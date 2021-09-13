import * as loginHelper from '../../../../helpers/login';
import { navigation } from '../../../../helpers/navigation';
import {
  cdsHelper,
  strategyRequestAlias,
} from '../../../../helpers/vendor/cds/cds';
import { profileTagHelper } from '../../../../helpers/vendor/cds/profile-tag';

describe('login notification', () => {
  const loginAlias = 'loginNotification';
  beforeEach(() => {
    cy.server();
    cdsHelper.setUpMocks(strategyRequestAlias);
    cy.intercept('POST', '**/users/current/loginnotification*').as(loginAlias);
    navigation.visitHomePage({
      options: {
        onBeforeLoad: profileTagHelper.interceptProfileTagJs,
      },
    });
    profileTagHelper.waitForCMSComponents();
    profileTagHelper.triggerLoaded();
    profileTagHelper.triggerConsentReferenceLoaded();
  });
  it('should not call the login endpoint of EC on a failed login', () => {
    loginHelper.loginWithBadCredentials();
    navigation
      .visitHomePage({
        options: {
          onBeforeLoad: profileTagHelper.interceptProfileTagJs,
        },
      })
      .then(() => {
        expect(navigation.requestsCount(loginAlias)).eq(0);
      });
  });
  it('should call the login endpoint of EC on a successful login', () => {
    loginHelper.registerUser();
    loginHelper.loginUser();
    cy.wait(`@${loginAlias}`).then((xhr) => {
      expect(xhr.request.headers['X-Consent-Reference']).to.eq(
        profileTagHelper.testCr
      );
    });
  });
});
