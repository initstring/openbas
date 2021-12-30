import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '../../../components/Select';
import inject18n from '../../../components/i18n';

class ParametersForm extends Component {
  render() {
    const { t, onSubmit, initialValues } = this.props;
    return (
      <Form
        keepDirtyOnReinitialize={true}
        onSubmit={onSubmit}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <form id="parametersForm" onSubmit={handleSubmit}>
            <Select
              variant="standard"
              label={t('Default theme')}
              name="platform_theme"
              fullWidth={true}
            >
              <MenuItem key="dark" value="dark">
                {t('Dark')}
              </MenuItem>
              <MenuItem key="light" value="light">
                {t('Light')}
              </MenuItem>
            </Select>
            <Select
              variant="standard"
              label={t('Default language')}
              name="platform_lang"
              fullWidth={true}
              style={{ marginTop: 20 }}
            >
              <MenuItem key="auto" value="auto">
                {t('Automatic')}
              </MenuItem>
              <MenuItem key="en" value="en">
                English
              </MenuItem>
              <MenuItem key="fr" value="fr">
                Français
              </MenuItem>
            </Select>
          </form>
        )}
      </Form>
    );
  }
}

ParametersForm.propTypes = {
  t: PropTypes.func,
  error: PropTypes.string,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  organizations: PropTypes.object,
};

export default inject18n(ParametersForm);
