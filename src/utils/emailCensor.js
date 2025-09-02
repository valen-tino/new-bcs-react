export const censorEmail = (email) => {
      if (!email || typeof email !== 'string') {
        return '';
      }

      const atIndex = email.indexOf('@');
      if (atIndex === -1) {
        return email; // Not a valid email format
      }

      const username = email.substring(0, atIndex);
      const domain = email.substring(atIndex);

      // Show the first 3 characters of the username, then censor the rest
      const censoredUsername = username.substring(0, 3) + '*'.repeat(username.length - 3);

      return censoredUsername + domain;
    };