import React from "react";
import { Link, NavLink } from "react-router-dom";
import $ from 'jquery';
// reactstrap components
import Dropzone from "../components/Dropzone/Dropzone";
import {
  Button,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  NavItem,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

var firebase = require('firebase');

class Index extends React.Component {
  componentDidMount(){
    $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
        console.log(data)
    })

    var modal = document.querySelectorAll(".modal")

    var doccount = 0;
    var signcount = 0;
    var requestcount = 0;
    var completecount = 0;

      firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // user exists, do stuff
          var userid = user.uid;
    console.log('user logged in');
    

    try {
      var leadsRef = firebase.database().ref('Users/'+userid)
  console.log('found ref');
leadsRef.on('value', function(snapshot) {
  var Child = snapshot.val();
    var email = Child.UserEmail; 

    var ref = firebase.database().ref('Users/'+userid+ '/Requests/');
        ref.on("value", function(snapshot) {
          if(snapshot.exists()){
            var recievedcontent = '';
            snapshot.forEach(function(data){
              requestcount =  requestcount + 1;

            });
          }
        });

    
});





var ref = firebase.database().ref(userid+'/Documents');
    ref.on("value", function(snapshot) {
      if(snapshot.exists()){
        snapshot.forEach(function(data){
      var val = data.val();
      if(val.Status == 'Sent'){
        signcount =  signcount + 1;
      }
      else if(val.Status == 'Completed'){
        completecount = completecount + 1;
      }
      doccount = doccount+ 1;
      });
        
    }
    //$('#load').fadeOut('slow');

    try {
      document.getElementById('homedocspan').innerHTML = doccount;
    document.getElementById('homesentspan').innerHTML = signcount;
    document.getElementById('homecompletespan').innerHTML = completecount;
    document.getElementById('homerequestspan').innerHTML = requestcount;
    } catch (error) {
      
    }
    
  });
    } catch (error) {
      
    }
    
      } else {
          // no user
          window.location.hash = "#/auth/login";
    
      }
      });
      
  }
 
  render() {
    return (
      <>
        <Header >
            
        </Header>
        {/* Page content */}
        <div className="modal">
        <div className="modal-content">
          <div><p>Please wait while we fetch your details.</p><div className="lds-dual-ring"></div></div>
          
          </div>
        </div>

        
           
          
          <Row className="mt--7 mx-6">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-white shadow">
              <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-black ls-1 mb-1">
                        Dropzone
                      </h6>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        
                        <NavItem>
                          <NavLink className="py-2 px-1"   to="/admin/templates" tag={Link}>
                            <Button
                            color="primary"
                            >
                            <span className="d-none d-md-block">Templates</span>
                            <span className="d-md-none">></span>
                            </Button>
                            
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
              
                
                <CardBody>
                <Dropzone/>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          <Row className="mt-5 mx-6 mb-3">
            
            
            <Col lg="6" xl="3">
              <a href="#/admin/manage?action=inbox">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Documents
                          </CardTitle>
                          <span id="homedocspan" className="h2 font-weight-bold mb-0">
                            35
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-folder-open" />
                          </div>
                        </Col>
                      </Row>
                      
                    </CardBody>
                  </Card>
                  </a>
                </Col>
                
                <Col lg="6" xl="3">
                <a href="#/admin/manage?action=sent">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Sent
                          </CardTitle>
                          <span id="homesentspan" className="h2 font-weight-bold mb-0">
                            24
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-file-contract" />
                          </div>
                        </Col>
                      </Row>
                      
                    </CardBody>
                  </Card>
                  </a>
                </Col>
                <Col lg="6" xl="3">
                <a href="#/admin/manage?action=completed">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Completed
                          </CardTitle>
                          <span id="homecompletespan" className="h2 font-weight-bold mb-0">24</span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                            <i className="fas fa-file-signature" />
                          </div>
                        </Col>
                      </Row>
                      
                    </CardBody>
                  </Card>
                  </a>
                </Col>
                <Col lg="6" xl="3">
                <a href="#/admin/manage?action=requests">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Requests
                          </CardTitle>
                          <span id="homerequestspan" className="h2 font-weight-bold mb-0">4</span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-file-import" />
                          </div>
                        </Col>
                      </Row>
                      
                    </CardBody>
                  </Card>
                  </a>
                </Col>


          </Row>
      </>
    );
  }
}

export default Index;
