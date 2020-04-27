import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import Unfavorite from './like.png'
import Favorite from './red.png'
import FakeAd from './fake-ad.png'
import axios from "axios";

class CardDetails extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      photo: null,
      card: null,
      id: null,
      rating: 0,
      overallrating: 0,
      comments: [],
      cardRating: null,
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    fetch("/getUserInfo")
      .then((res) => res.json())
      .then((userData) => {
        this.setState({
          username: userData.username,
          photo: userData.imgUrl,
          id: this.props.match.params.id,
        });
      })
      .then(() => {
        axios.get('/getFavorite')
        .then((res) => {
          if(res.data.favorite.length === 0){
            document.getElementById('favorite').style.display =' none'
            document.getElementById('unfavorite').style.display ='inline-block'
          }
          else{
            res.data.favorite.map((data) => {
        
              if(data.cardId === this.state.id){
                document.getElementById('unfavorite').style.display =' none'
                document.getElementById('favorite').style.display ='inline-block'
              }
            })
          }
                })
      })
      .then(() => {
        axios
          .post("/getCardData", {
            id: this.state.id,
          })
          .then((res) => {
            this.setState({
              card: res.data.img,
              comments: res.data.comments,
            });
            let average = [];
            res.data.ratings.map((data) => {
              average.push(data.rating);
              this.setState({
                overallrating:
                  average.reduce((p, c) => p + c, 0) / average.length,
              });
              if (data.username === this.state.username) {
                this.setState({
                  cardRating: data.rating,
                });
                document.getElementById("rating").style.display = "none";
                document.getElementById("rating-span").style.display = "block";
              }
            });
          })
          .then(() => {
            if (this.state.comments.length != 0) {
              document.getElementById("no-comment").style.display = "none";
              document.getElementById("ul").style.display = "block";
            }
          });
      });
  }
  changeRating = (newRating) => {
    axios
      .post("/saveRating", {
        id: this.state.id,
        rating: newRating,
        username: this.state.username,
      })
      .then(() => {
        axios
          .post("/getCardData", {
            id: this.state.id,
          })
          .then((res) => {
            let average = [];
            res.data.ratings.map((data) => {
              average.push(data.rating);
              this.setState({
                overallrating:
                  average.reduce((p, c) => p + c, 0) / average.length,
              });
            });
          });
      })
      .catch((err) => console.log(err));

    this.setState({
      rating: newRating,
    });
    document.getElementById("rating-span").style.display = "block";
    document.getElementById("rating").style.display = "none";
  };
  logout = () => {
    fetch("/logoutUser", {
      method: "POST",
    }).then((res) => {
      if (res.status) {
        this.props.history.push("/");
      }
    });
  };
  postComment = () => {
    document.getElementById("no-comment").style.display = "none";
    document.getElementById("ul").style.display = "block";
    this.setState({
      comments: [
        ...this.state.comments,
        {
          comment: this.refs.comment.value,
          date: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
          img: this.state.photo,
        },
      ],
    });
    document.getElementById("ul").scrollTop = document.getElementById(
      "ul"
    ).scrollHeight;
    axios
      .post("/saveComment", {
        id: this.state.id,
        comment: this.refs.comment.value,
      })
      .catch((err) => console.log(err));
  };
  dashboard = () => {
    this.props.history.push("/dashboard");
  };
  toggleHide =(e) => {
    if(e.target.id === 'unfavorite'){
    document.getElementById('unfavorite').style.display =' none'
    document.getElementById('favorite').style.display ='inline-block'
    axios.post('/addFavorite', {
      img: this.state.card,
      imgId: this.state.id
    })
    .catch((err) => console.log(err))
    }
    if(e.target.id === 'favorite'){
      axios.post('/removeFavorite', {
        img: this.state.card,
        imgId: this.state.id
      })
      .catch((err) => console.log(err))
      document.getElementById('favorite').style.display =' none'
      document.getElementById('unfavorite').style.display ='inline-block'
      }
  }
  render() {
    return (
      <div>
        <nav
          style={{ marginTop: "-40px" }}
          className="navbar bg-dark navbar-dark "
        >
          <button
            style={{ padding: "10px" }}
            type="button"
            className="btn btn-outline-info btn-lg float-left "
            onClick={this.dashboard}
          >
            Back
          </button>
          <ul className="navbar-nav">
            <li className="nav-item">
              <h4
                style={{
                  color: "white",
                  padding: "10px",
                  textTransform: "capitalize",
                }}
              >
                {this.state.username}
              </h4>
            </li>
            <ul className="nav navbar-nav navbar-right"></ul>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <button
                style={{ padding: "10px" }}
                type="button"
                className="btn btn-outline-danger btn-lg float-right "
                onClick={this.logout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
        <div className='row justify-content-center' style={{marginTop: '25px'}}>
          <img src={FakeAd} width={window.innerWidth / 1.3} alt=""/>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 ">
            <div
              style={{
                backgroundImage: `url(${this.state.card})`,
                height: "500px",
                width: "300px",
                marginTop: "-40px",
              }}
            ></div>
            
            <div style={{ marginLeft: "60px", marginTop: "-20px" }}>
              <StarRatings
                id="overall-rating"
                rating={this.state.overallrating}
                isSelectable={false}
                starRatedColor="#FEC22A"
                isAggregateRating={true}
                starWidthAndHeight={"25px"}
                starDimension="25px"
                className="StarRatings"
              />
              <img src={Unfavorite} height='30px' id='unfavorite' onClick={this.toggleHide} style={{marginLeft: '25px'}} width='30px' alt=""/>
              <img src={Favorite} height='30px' id='favorite'onClick={this.toggleHide} style={{marginLeft: '25px', display: 'none'}} width='30px' alt=""/>
              <p style={{ marginLeft: "10px" }}>
                Over all rating is {this.state.overallrating.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div
              class="detailBox mr-0"
              id="commentBox"
              style={{ marginTop: "80px" }}
            >
              <div class="titleBox text-center">
                <label>Comments</label>
              </div>
              <div class="actionBox">
                <h6 id="no-comment" style={{ textAlign: "center" }}>
                  No comments yet
                </h6>
                <ul class="commentList" id="ul" style={{ display: "none" }}>
                  {this.state.comments.map((data, key) => (
                    <li key={key}>
                      <div class="commenterImage">
                        <img src={data.img} alt={data.username} />
                      </div>
                      <div class="commentText">
                        <p class="">{data.comment}</p>{" "}
                        <span class="date sub-text">on {data.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div class="form-inline">
                  <div class="form-group">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Your comments"
                      ref="comment"
                    />
                  </div>
                  <div class="form-group">
                    <button class="btn btn-default" onClick={this.postComment}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div id="rating" style={{ marginLeft: "120px" }}>
              <StarRatings
                rating={this.state.rating}
                starRatedColor="#FEC22A"
                starHoverColor="#FEC02A"
                changeRating={this.changeRating}
                numberOfStars={5}
                isSelectable={false}
                starDimension="25px"
                name="rating"
              />
              <br />
              <span style={{ marginLeft: "50px" }}>Rate this card</span>
            </div>
            <span
              style={{ display: "none", marginLeft: "120px" }}
              id="rating-span"
            >
              You've rated this card{" "}
              {this.state.cardRating || this.state.rating} stars
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default CardDetails;
