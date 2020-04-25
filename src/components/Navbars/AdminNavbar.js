import React from "react";
import { Link, NavLink } from "react-router-dom";
import $ from 'jquery';
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

var firebase = require('firebase');

class AdminNavbar extends React.Component {
  componentDidMount(){
    var userid = "";
    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

        userid = user.uid;
        try {
          var storageRef = firebase.storage().ref();
          storageRef.child(userid + '/ProfilePic/profilepic.png').getDownloadURL().then(function(url){
          // `url` is the download URL for 'images/stars.jpg'
        
          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
          var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
        
            // Or inserted into an <img> element:
            console.log(url)
            var img = document.getElementById('navbarprofilpic');
            img.setAttribute('crossOrigin', 'anonymous');
          img.src = url;
          
          
            }).catch(function(error) {
            // Handle any errors
        });
        } catch (error) {
          
        }

        

        var leadsRef = firebase.database().ref('Users/'+userid)
		leadsRef.on('value', function(snapshot) {
			var Child = snapshot.val();
        var name = Child.UserFirstName;
        try {
          document.getElementById('navbarname').innerHTML  = name ;
        } catch (error) {
          
        }
        

        
        
  });
  
  

      }
      else{
        
        //window.location.hash = "#/auth/login";
        
      }
    });
    
  }
  render() {
    return (
      <>
      <Navbar
        className="navbar-top navbar-horizontal navbar-dark"
        expand="md"
      >
        <Container className="px-4" fluid>
            <img alt="..." style={{ maxWidth: "170px" }} src="./pappayasign_white.png" />
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                    <img
                      alt="..."
                      src="./pappayasign.png"
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    id="navbar-collapse-main"
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto mr-auto" fluid="true" navbar>
              <NavItem>
                <NavLink id="homebtn" className="nav-link-icon navtop " activeClassName="active"  to="/admin/index" tag={Link}>
                <span className="btn-inner--icon">
                  <i className="material-icons" >home</i>
                  </span>
                  <span className="btn-inner--text">Home</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink id="managebtn" className="nav-link-icon navtop" activeClassName="active" to="/admin/manage" tag={Link}>
                <span className="btn-inner--icon">
                  <i className="material-icons" >chrome_reader_mode</i>
                  </span>
                  <span className="btn-inner--text">Manage</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink id="settingsbtn" className="nav-link-icon navtop" activeClassName="active" to="/admin/user-profile" tag={Link}>
                <span className="btn-inner--icon">
                  <i className="material-icons" >settings</i>
                  </span>
                  <span className="btn-inner--text">Settings</span>
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      id="navbarprofilpic"
                      src={"/team-4-800x800.jpg"}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span id="navbarname" className="mb-0 text-sm font-weight-bold">
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/manage" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Manage</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem to="/auth/login" tag={Link}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
    );
  }
}

export default AdminNavbar;
