import React, { Component } from "react";
import { upperCaseFirst } from "upper-case-first";
import FakeAd from './fake-ad.png'
import axios from "axios";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      photo: null,
      rating: 1,
      hearthStoneCards: [],
      searchResult: [],
    };
  }

  componentWillMount() {
    let cardsArray = [];
    axios
      .get("/cards")
      .then((res) => {
        res.data.map((card) => {
          cardsArray.push(card);
        });
      })
      .then(() => {
        this.setState({
          hearthStoneCards: cardsArray,
        });
      })
      .catch((err) => console.log(err));
  }
  setValues = (e) => {
    this.props.history.push(`/card/${e.target.getAttribute("id")}`);
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    fetch("/getUserInfo")
      .then((res) => res.json())
      .then((userData) => {
        this.setState({
          username: userData.username,
          photo: userData.imgUrl,
        });
      });
  }
  searchCard = () => {
    axios
      .post("/searchCard", {
        keyword: upperCaseFirst(this.refs.keyword.value),
      })
      .then((res) => {
        if (res.data.length === 0) {
          document.getElementById("not-found-span").style.display = "block";
          document.getElementById("all-cards").style.display = "none";
        } else {
          document.getElementById("not-found-span").style.display = "none";
          document.getElementById("all-cards").style.display = "block";
          this.setState({
            hearthStoneCards: res.data,
          });
        }
      })
      .catch((err) => console.log(err));
  };
  typeSearch = (e) => {
    axios
    .post("/searchCardByType", {
      keyword: e.target.value,
    })
    .then((res) => {
        let type = []
        res.data.map((card) => {
          type.push(card)
        })
        document.getElementById("not-found-span").style.display = "none";
        document.getElementById("all-cards").removeAttribute('style') 
        this.setState({
          hearthStoneCards: type
        });
      
    })
    .catch((err) => console.log(err));
  }
  logout = () => {
    fetch("/logoutUser", {
      method: "POST",
    }).then((res) => {
      if (res.status) {
        this.props.history.push("/");
      }
    });
  };
  openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };

  closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };
  render() {
    return (
      <div>
        <div id="mySidenav" style={{ textAlign: "center" }} className="sidenav">
          <a className="closebtn" onClick={this.closeNav}>
            &times;
          </a>
          <img
            src={this.state.photo}
            className="rounded-circle"
            height="100px"
            width="90px"
            alt={this.state.username}
          />
          <br /> <br />
          <h4
            style={{
              color: "white",
              textTransform: "capitalize",
            }}
          >
            {this.state.username}
          </h4>
          <Link to="/favorites">My Favourites</Link>
          <Link to="/updatePassword">Change Password</Link>
        </div>
        <nav
          style={{ marginTop: "-40px" }}
          className="navbar bg-dark navbar-dark "
        >
          <span
            style={{ fontSize: "30px", cursor: "pointer", color: "white" }}
            onClick={this.openNav}
          >
            &#9776;{" "}
          </span>
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
        <br />
        <div class="input-group " style={{ width: "50%", marginLeft: "25%" }}>
          <select onChange={this.typeSearch} class="custom-select" style={{ marginRight: "10px" }}>
            <option selected>Filter cards by type</option>
            <option value="Minion">Minion</option>
            <option value="Spell">Spell</option>
            <option value="Weapon">Weapon</option>
            <option value="Hero">Hero</option>
          </select>
          <input
            type="text"
            class="form-control"
            ref="keyword"
            placeholder="Search cards by name"
          />
          <div class="input-group-append">
            <button
              class="btn btn-secondary"
              onClick={this.searchCard}
              type="button"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div className='row justify-content-center' style={{marginTop: '25px'}}>
          <img src={FakeAd} width={window.innerWidth / 1.3} alt=""/>
        </div>
        <div className="row justify-content-center">
          <strong
            id="not-found-span"
            className="text-center"
            style={{ textAlign: "center", display: "none", marginTop: "50px" }}
          >
            No result found.Try another word
          </strong>
        </div>

        <div id="all-cards" className="row">
          {this.state.hearthStoneCards.map((card, key) => (
            <div className="col-md-4" style={{ textAlign: "center" }} key={key}>
              <div
                style={{
                  backgroundImage: `url(${card.img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  height: "500px",
                }}
                id={card._id}
                onClick={this.setValues}
              ></div>
              <strong style={{ marginTop: "30px" }}>{card.name}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Dashboard;
