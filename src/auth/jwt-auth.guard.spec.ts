import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: Partial<ExecutionContext>;
    let request: any;

    beforeEach(() => {
      request = {
        headers: {},
      };
      mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => request,
          getResponse: jest.fn(),
          getNext: jest.fn(),
        }),
      };
    });

    it('should throw UnauthorizedException if authorization header is not present', () => {
      expect(() =>
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).toThrow(UnauthorizedException);
      expect(() =>
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).toThrow('Authorization token is not present');
    });

    it('should throw UnauthorizedException if token format is invalid', () => {
      request.headers['authorization'] = 'InvalidTokenFormat';

      expect(() =>
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).toThrow(UnauthorizedException);
      expect(() =>
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).toThrow('Invalid token format, Should be Bearer...');
    });

    it('should call super.canActivate if authorization header is valid', () => {
      request.headers['authorization'] = 'Bearer valid.token.here';

      const canActivateSpy = jest
        .spyOn(JwtAuthGuard.prototype, 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );
      expect(result).toBe(true);
      expect(canActivateSpy).toHaveBeenCalled();
    });
  });
});
