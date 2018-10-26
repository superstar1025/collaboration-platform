/* istanbul ignore file */
import React from 'react';
import { Redirect } from 'react-router-dom';

// TODO: Should Improve later. For now it is redirected to user page.
export const UsersList = () => <Redirect to="/users/me" />;

export default UsersList;
