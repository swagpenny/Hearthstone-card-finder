import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'

class Favorites extends Component{
    constructor(props){
        super(props);
        this.state={
            username: null,
            favorites: []
        }
    }
    componentDidMount(){
        axios.get('/getUserInfo')
        .then((res) => {
            this.setState({
                username: res.data.username
            })
        })
        .then(() => {
            axios.get('/getFavorite')
            .then((res) => {
                this.setState({
                    favorites: res.data.favorite
                })
            })
        })
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
    render(){
        return(
            <div>
                   <nav
          style={{ marginTop: "-40px" }}
          className="navbar bg-dark navbar-dark "
        >
          <Link
            style={{ padding: "10px" }}
            type="button"
            className="btn btn-outline-info btn-lg float-left "
            to='/dashboard'
          >
            Back
          </Link>
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
        <h3 style={{textAlign: 'center', marginTop: '20px'}}>My Favourites</h3>
        <div id="all-cards" className="row justify-content-center">
          {this.state.favorites.map((card, key) => (
            <div className="col-md-4" key={key}>
              <div
                className="img-fluid"
                style={{
                  backgroundImage: `url(${card.img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  height: "500px",
                }}
              ></div>
            </div>
          ))}
        </div>
            </div>
        )
    }
}
export default Favorites;