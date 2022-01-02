import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import withStyles from '@mui/styles/withStyles';
import { Add } from '@mui/icons-material';
import { addPlayer } from '../../../actions/User';
import PlayerForm from './PlayerForm';
import inject18n from '../../../components/i18n';

const styles = () => ({
  createButton: {
    position: 'fixed',
    bottom: 30,
    right: 30,
  },
});

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = 'TransitionSlide';

class CreatePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  onSubmit(data) {
    const inputValues = R.pipe(
      R.assoc(
        'user_organization',
        data.user_organization && data.user_organization.id
          ? data.user_organization.id
          : data.user_organization,
      ),
      R.assoc('user_tags', R.pluck('id', data.user_tags)),
    )(data);
    return this.props
      .addPlayer(inputValues)
      .then((result) => (result.result ? this.handleClose() : result));
  }

  render() {
    const { classes, t, organizations } = this.props;
    return (
      <div>
        <Fab
          onClick={this.handleOpen.bind(this)}
          color="primary"
          aria-label="Add"
          className={classes.createButton}
        >
          <Add />
        </Fab>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          onClose={this.handleClose.bind(this)}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>{t('Create a new player')}</DialogTitle>
          <DialogContent>
            <PlayerForm
              editing={false}
              onSubmit={this.onSubmit.bind(this)}
              organizations={organizations}
              initialValues={{ user_tags: [] }}
              handleClose={this.handleClose.bind(this)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

CreatePlayer.propTypes = {
  t: PropTypes.func,
  addPlayer: PropTypes.func,
};

export default R.compose(
  connect(null, { addPlayer }),
  inject18n,
  withStyles(styles),
)(CreatePlayer);
