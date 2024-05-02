import { Component } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'tn-security',
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent {

  /**
   * Password should contain:
   * - at least 1 lower case character,
   * - at least 1 upper case character,
   * - at least 1 digit,
   * - at least 1 special character,
   * - at least 8 characters.
   */
  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  get satisfiesPasswordRules(): boolean {
    return this.newPassword.length > 0 && this.passwordRegex.test(this.newPassword);
  }

  constructor(private readonly userService: UserService) { }

  async changePassword(): Promise<void> {
    if (this.newPassword.length === 0) {
      this.errorMessage = 'New password is empty';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords are not the same';
      return;
    }

    if (this.satisfiesPasswordRules === false) {
      this.errorMessage = 'Password does not satisfy rules';
      return;
    }

    try {
      await this.userService.updatePassword(this.newPassword);
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (e) {
      console.error(e);
    } finally {
      this.errorMessage = '';
    }
  }
}
