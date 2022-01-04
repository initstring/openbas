import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as R from 'ramda';
import { withStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { connect } from 'react-redux';
import { interval } from 'rxjs';
import {
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import inject18n from '../../../../components/i18n';
import { durationFormat, FIVE_SECONDS } from '../../../../utils/Time';
import ItemTags from '../../../../components/ItemTags';
import SearchFilter from '../../../../components/SearchFilter';
import TagsFilter from '../../../../components/TagsFilter';
import { storeBrowser } from '../../../../actions/Schema';
import { fetchExerciseInjects } from '../../../../actions/Inject';
import InjectIcon from './InjectIcon';

const interval$ = interval(FIVE_SECONDS);

const styles = (theme) => ({
  parameters: {
    float: 'left',
    marginTop: -10,
  },
  container: {
    marginTop: 10,
  },
  itemHead: {
    paddingLeft: 10,
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  item: {
    paddingLeft: 10,
    height: 50,
  },
  bodyItem: {
    height: '100%',
    fontSize: 13,
  },
  itemIcon: {
    color: theme.palette.primary.main,
  },
  goIcon: {
    position: 'absolute',
    right: -10,
  },
  inputLabel: {
    float: 'left',
  },
  sortIcon: {
    float: 'left',
    margin: '-5px 0 0 15px',
  },
  icon: {
    color: theme.palette.primary.main,
  },
});

const inlineStylesHeaders = {
  iconSort: {
    position: 'absolute',
    margin: '0 0 0 5px',
    padding: 0,
    top: '0px',
  },
  inject_type: {
    float: 'left',
    width: '10%',
    fontSize: 12,
    fontWeight: '700',
  },
  inject_title: {
    float: 'left',
    width: '25%',
    fontSize: 12,
    fontWeight: '700',
  },
  inject_depends_duration: {
    float: 'left',
    width: '15%',
    fontSize: 12,
    fontWeight: '700',
  },
  inject_players: {
    float: 'left',
    width: '15%',
    fontSize: 12,
    fontWeight: '700',
  },
  inject_tags: {
    float: 'left',
    fontSize: 12,
    fontWeight: '700',
  },
};

const inlineStyles = {
  inject_type: {
    float: 'left',
    width: '10%',
    height: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  inject_title: {
    float: 'left',
    width: '25%',
    height: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  inject_depends_duration: {
    float: 'left',
    width: '15%',
    height: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  inject_players: {
    float: 'left',
    width: '15%',
    height: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  inject_tags: {
    float: 'left',
    height: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

class Injects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'inject_depends_duration',
      orderAsc: true,
      keyword: '',
      tags: [],
    };
  }

  componentDidMount() {
    const { exercise } = this.props;
    this.props.fetchExerciseInjects(exercise.exercise_id);
    this.subscription = interval$.subscribe(() => {
      this.props.fetchExerciseInjects(exercise.exercise_id);
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  handleSearch(value) {
    this.setState({ keyword: value });
  }

  handleAddTag(value) {
    if (value) {
      this.setState({ tags: R.uniq(R.append(value, this.state.tags)) });
    }
  }

  handleRemoveTag(value) {
    this.setState({ tags: R.filter((n) => n.id !== value, this.state.tags) });
  }

  reverseBy(field) {
    this.setState({ sortBy: field, orderAsc: !this.state.orderAsc });
  }

  sortHeader(field, label, isSortable) {
    const { t } = this.props;
    const { orderAsc, sortBy } = this.state;
    const sortComponent = orderAsc ? (
      <ArrowDropDownOutlined style={inlineStylesHeaders.iconSort} />
    ) : (
      <ArrowDropUpOutlined style={inlineStylesHeaders.iconSort} />
    );
    if (isSortable) {
      return (
        <div
          style={inlineStylesHeaders[field]}
          onClick={this.reverseBy.bind(this, field)}
        >
          <span>{t(label)}</span>
          {sortBy === field ? sortComponent : ''}
        </div>
      );
    }
    return (
      <div style={inlineStylesHeaders[field]}>
        <span>{t(label)}</span>
      </div>
    );
  }

  render() {
    const {
      t, classes, injects, exercise,
    } = this.props;
    const {
      keyword, sortBy, orderAsc, tags,
    } = this.state;
    const filterByKeyword = (n) => keyword === ''
      || (n.inject_title || '').toLowerCase().indexOf(keyword.toLowerCase())
        !== -1
      || (n.inject_description || '')
        .toLowerCase()
        .indexOf(keyword.toLowerCase()) !== -1
      || (n.inject_content || '').toLowerCase().indexOf(keyword.toLowerCase())
        !== -1;
    const sort = R.sortWith(
      orderAsc ? [R.ascend(R.prop(sortBy))] : [R.descend(R.prop(sortBy))],
    );
    const sortedInjects = R.pipe(
      R.filter(
        (n) => tags.length === 0
          || R.any(
            (filter) => R.includes(filter, n.inject_tags || []),
            R.pluck('id', tags),
          ),
      ),
      R.filter(filterByKeyword),
      sort,
    )(injects);
    return (
      <div className={classes.container}>
        <div className={classes.parameters}>
          <div style={{ float: 'left', marginRight: 20 }}>
            <SearchFilter
              small={true}
              onChange={this.handleSearch.bind(this)}
              keyword={keyword}
            />
          </div>
          <div style={{ float: 'left', marginRight: 20 }}>
            <TagsFilter
              onAddTag={this.handleAddTag.bind(this)}
              onRemoveRag={this.handleRemoveTag.bind(this)}
              currentTags={tags}
            />
          </div>
        </div>
        <div className="clearfix" />
        <List classes={{ root: classes.container }}>
          <ListItem
            classes={{ root: classes.itemHead }}
            divider={false}
            style={{ paddingTop: 0 }}
          >
            <ListItemIcon>
              <span
                style={{
                  padding: '0 8px 0 8px',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                #
              </span>
            </ListItemIcon>
            <ListItemText
              primary={
                <div>
                  {this.sortHeader('inject_type', 'Type', true)}
                  {this.sortHeader('inject_title', 'Title', true)}
                  {this.sortHeader('inject_depends_duration', 'Trigger', true)}
                  {this.sortHeader('inject_players', 'Players', false)}
                  {this.sortHeader('inject_tags', 'Tags', true)}
                </div>
              }
            />
            <ListItemSecondaryAction> &nbsp; </ListItemSecondaryAction>
          </ListItem>
          {sortedInjects.map((inject) => {
            const injectUsersNumber = inject?.inject_users_number ?? '-';
            const impactedUsers = inject.inject_all_audiences
              ? exercise.getUsers().length
              : injectUsersNumber;
            return (
              <ListItem
                key={inject.tag_id}
                classes={{ root: classes.item }}
                divider={true}
              >
                <ListItemIcon>
                  <InjectIcon type={inject.inject_type} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <div>
                      <div
                        className={classes.bodyItem}
                        style={inlineStyles.inject_type}
                      >
                        {t(inject.inject_type)}
                      </div>
                      <div
                        className={classes.bodyItem}
                        style={inlineStyles.inject_title}
                      >
                        {inject.inject_title}
                      </div>
                      <div
                        className={classes.bodyItem}
                        style={inlineStyles.inject_depends_duration}
                      >
                        {durationFormat(inject.inject_depends_duration)}
                      </div>
                      <div
                        className={classes.bodyItem}
                        style={inlineStyles.inject_players}
                      >
                        {impactedUsers}
                      </div>
                      <div
                        className={classes.bodyItem}
                        style={inlineStyles.inject_tags}
                      >
                        <ItemTags
                          variant="list"
                          tags={inject.getTags('tag_name', true, 4)}
                        />
                      </div>
                    </div>
                  }
                />
                <ListItemSecondaryAction>
                  <ChevronRightOutlined />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

Injects.propTypes = {
  t: PropTypes.func,
  nsdt: PropTypes.func,
  exercise: PropTypes.object,
  injects: PropTypes.array,
  fetchExerciseInjects: PropTypes.func,
};

const select = (state, ownProps) => {
  const browser = storeBrowser(state);
  const { exercise } = ownProps;
  return {
    injects: browser.getExercise(exercise.exercise_id).getInjects(),
  };
};

export default R.compose(
  connect(select, { fetchExerciseInjects }),
  inject18n,
  withStyles(styles),
)(Injects);
