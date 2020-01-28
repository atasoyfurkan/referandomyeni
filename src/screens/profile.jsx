import React, { Component } from "react";
import { connect } from "react-redux";
import VoteCardForAkis from "../components/voteCardForAkis";
import ProfileCard from "../components/profileCard";
import FooterCard from "../components/footerCard";
import LoadingSpinner from "../components/loadingSpinner";
import {
  getUserForProfileMoreDetailsById,
  uiFinishLoadingExtra,
  uiStartLoadingExtra,
  loadHistory
} from "../store/actions/index";

class Profile extends Component {
  async componentDidMount() {
    this.props.onLoadHistory(this.props.history);

    this.props.onUiStartLoadingExtra();
    if (this.props.mode === "visit") {
      const id = this.props.history.location.pathname.slice(7);
      await this.props.onGetUserWithDetailsById(id);
    }
    this.props.onUiFinishLoadingExtra();
  }

  findVoteCard = id => {
    const data = this.props.data.find(element => element._id === id);
    return data;
  };

  render() {
    return (
      <React.Fragment>
        <LoadingSpinner
          isLoaded={this.props.isLoaded && this.props.isLoadedExtra}
        />
        {this.props.isLoaded && this.props.isLoadedExtra && (
          <React.Fragment>
            <section className="desktop-hidden">
              <main className="row justify-content-center d-flex">
                <div className="col-11 col-sm-10 col-md-9 col-lg-6">
                  <ProfileCard
                    visitedUser={
                      this.props.mode === "visit" ? this.props.user : null
                    }
                    mode={this.props.mode}
                  />

                  {this.props.user &&
                    this.props.user.votedCards
                      .slice(0)
                      .reverse()
                      .map(
                        element =>
                          element.mainCard && (
                            <VoteCardForAkis
                              visitedUser={
                                this.props.mode === "visit"
                                  ? this.props.user
                                  : null
                              }
                              key={element._id}
                              data={this.findVoteCard(element.mainCard._id)}
                              vote={element.vote}
                              history={this.props.history}
                              mode="profile"
                            />
                          )
                      )}
                </div>
              </main>
            </section>
            <section className="mobile-hidden">
              <main className="ui container d-flex">
                <div className="ui stackable grid basic segment" id="akis">
                  <div className="ui rail" style={{ width: "31.3%" }}>
                    <div className="ui sticky fixed top  a-sticky">
                      <ProfileCard
                        visitedUser={
                          this.props.mode === "visit" ? this.props.user : null
                        }
                        mode={this.props.mode}
                      />
                      <FooterCard />
                    </div>
                  </div>
                  <div className="five wide column sidebar mobile-hidden" />
                  <div className="eleven wide column" id="onergeler">
                    {this.props.user &&
                      this.props.user.votedCards
                        .slice(0)
                        .reverse()
                        .map(
                          element =>
                            element.mainCard && (
                              <VoteCardForAkis
                                visitedUser={
                                  this.props.mode === "visit"
                                    ? this.props.user
                                    : null
                                }
                                key={element._id}
                                data={this.findVoteCard(element.mainCard._id)}
                                vote={element.vote}
                                history={this.props.history}
                                mode="profile"
                              />
                            )
                        )}
                  </div>
                </div>
              </main>
            </section>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.moreData,
    data: state.voteCard.data,
    isLoaded: state.ui.isLoaded,
    isLoadedExtra: state.ui.isLoadedExtra
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUserWithDetailsById: id =>
      dispatch(getUserForProfileMoreDetailsById(id)),

    onUiFinishLoadingExtra: () => dispatch(uiFinishLoadingExtra()),
    onUiStartLoadingExtra: () => dispatch(uiStartLoadingExtra()),
    onLoadHistory: history => dispatch(loadHistory(history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
