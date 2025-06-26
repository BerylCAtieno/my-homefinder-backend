// Import necessary modules for testing
import { Request, Response, NextFunction } from 'express';
import { VerificationController } from '../../../controllers/verification.controller';
import { VerificationService } from '../../../services/verification.service';
import { StatusCodes } from 'http-status-codes';
import { mock, instance, when, verify as tsVerify, anyFunction } from 'ts-mockito';

describe('VerificationController', () => {
    // Declare mocked instances
    let mockedVerificationService: VerificationService;
    let verificationServiceInstance: VerificationService;
    let verificationController: VerificationController;

    // Mock Express Request, Response, and NextFunction
    let req: Request;
    let res: Response;
    let next: NextFunction;

    // Before each test, re-initialize mocks and controller
    beforeEach(() => {
        // Create a mock instance of VerificationService
        mockedVerificationService = mock(VerificationService);
        // Get the concrete instance from the mock to pass to the controller
        verificationServiceInstance = instance(mockedVerificationService);

        // Manually inject the mocked service into the controller's constructor
        // By default, the controller creates its own service.
        // We'll override that or create a testable constructor.
        // For simplicity here, we'll create an instance and then
        // directly assign the mocked service. In a real project,
        // consider constructor injection or a factory for testing.
        verificationController = new VerificationController();
        (verificationController as any).verificationService = verificationServiceInstance;

        // Mock Express response methods
        res = {
            status: jest.fn().mockReturnThis(), // Allow chaining .status().json()
            json: jest.fn(),
        } as unknown as Response; // Cast to unknown first to satisfy TypeScript

        // Mock Express request (only what's needed for the test)
        req = {
            body: {}, // Initialize with an empty body
        } as Request;

        // Mock NextFunction
        next = jest.fn();
    });

    describe('verify', () => {
        it('should call verifyID service and return 200 OK with message on success', async () => {
            // Arrange
            const docId = 'someDocId';
            // Updated renterIdDetails to match the interface expected by VerificationService
            const renterIdDetails = { name: 'John Doe', idNumber: '123', bvnNumber: '456' };
            // Changed expectedMessage to an object matching the service's return type
            const expectedMessage = { message: 'Verification successful!' };

            req.body = { docId, renterIdDetails };

            // Configure the mocked service to return a specific value when verifyID is called
            when(mockedVerificationService.verifyID(docId, renterIdDetails))
                .thenResolve(expectedMessage);

            // Act
            await verificationController.verify(req, res, next);

            // Assert
            // Verify that verifyID was called with the correct arguments
            tsVerify(mockedVerificationService.verifyID(docId, renterIdDetails)).once();
            // Verify that res.status was called with StatusCodes.OK (200)
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            // Verify that res.json was called with the expected message
            expect(res.json).toHaveBeenCalledWith(expectedMessage);
            // Verify that next was NOT called (no error occurred)
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if verificationService.verifyID throws an error', async () => {
            // Arrange
            const docId = 'someDocId';
            // Updated renterIdDetails to match the interface
            const renterIdDetails = { name: 'John Doe', idNumber: '123', bvnNumber: '456' };
            const expectedError = new Error('Verification failed!');

            req.body = { docId, renterIdDetails };

            // Configure the mocked service to throw an error when verifyID is called
            when(mockedVerificationService.verifyID(docId, renterIdDetails))
                .thenReject(expectedError);

            // Act
            await verificationController.verify(req, res, next);

            // Assert
            // Verify that verifyID was called
            tsVerify(mockedVerificationService.verifyID(docId, renterIdDetails)).once();
            // Verify that res.status was NOT called
            expect(res.status).not.toHaveBeenCalled();
            // Verify that res.json was NOT called
            expect(res.json).not.toHaveBeenCalled();
            // Verify that next was called with the expected error
            expect(next).toHaveBeenCalledWith(expectedError);
        });

        it('should handle missing docId or renterIdDetails gracefully (edge case)', async () => {
            // This test assumes your service would handle validation or return a specific error.
            // If the service expects specific inputs and would throw, this test should reflect that.
            // For now, let's test a scenario where one is missing and service is still called.

            // Arrange
            const docId = undefined; // Missing docId
            // This case specifically tests partial `renterIdDetails`.
            // The service's `verifyID` method expects `renterIdDetails` as a parameter.
            // If the service's `renterIdDetails` interface requires `idNumber` and `bvnNumber`,
            // then passing only `{ name: 'Jane Doe' }` will still be a TypeScript error
            // unless `renterIdDetails` is made partially optional in the interface.
            // For this test, we assume the `idAnalyzer` or the service itself would
            // eventually throw an error due to malformed `idDetails`.
            // We cast to `any` here to allow the test to compile and assume the
            // service will throw as expected.
            const renterIdDetails = { name: 'Jane Doe' }; // Still partially missing, will rely on service to throw

            req.body = { docId, renterIdDetails };

            // Mock the service to handle these "missing" inputs (e.g., throw an error)
            const expectedError = new Error('Invalid input: docId or renterIdDetails missing/malformed');
            when(mockedVerificationService.verifyID(docId as any, renterIdDetails as any))
                .thenReject(expectedError);

            // Act
            await verificationController.verify(req, res, next);

            // Assert
            // Verify that verifyID was called with the (potentially undefined) arguments
            tsVerify(mockedVerificationService.verifyID(docId as any, renterIdDetails as any)).once();
            expect(next).toHaveBeenCalledWith(expectedError);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});

