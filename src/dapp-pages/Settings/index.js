import React from 'react';

import { PageTitle } from '../../layout-components';

import SettingsProfileForms from '../../dapp-components/Settings/SettingsProfileForms';
import SettingsPageTitleActions from '../../dapp-components/Settings/SettingsPageTitleActions';
export default function Settings() {
  return (
    <>
      <PageTitle
        titleHeading="Settings"
        titleDescription="Manage your profile settings from this example page.">
        <SettingsPageTitleActions />
      </PageTitle>
      <SettingsProfileForms />
    </>
  );
}
