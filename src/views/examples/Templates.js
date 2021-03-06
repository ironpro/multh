
import React from "react";
import classnames from "classnames";
import { Link, NavLink } from "react-router-dom";

import TemplateDataVar from '../../variables/templatedata';

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Button,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  CardBody
} from "reactstrap";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";
import $ from 'jquery';

var firebase = require('firebase');

class Templates extends React.Component {

  
    
  componentDidMount(){

    var modal = document.querySelectorAll(".modal")
    modal[0].style.display = "block";
    var userid = "";
    var email='';
    var reciverlist = '';
    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

        userid=user.uid;
        console.log(userid);
        try {
          


    var ref = firebase.database().ref(userid+'/Templates');
        ref.once("value", function(snapshot) {
          if(snapshot.exists()){
            var templatecontent = '';
            
            snapshot.forEach(function(data){
          var val = data.val();
          try {
            reciverlist = val.Reciever.length ;
          } catch (error) {
            
          }
          
          
          
          
          templatecontent +='<tr >';
          templatecontent +='<th scope="row"><span className="mb-0 text-sm">'+val.TemplateName+'</span></th>';
          templatecontent += '<td id="templateid">' + data.key + '</td>'
          templatecontent += '<td>' + reciverlist + '</td>';
          templatecontent += '<td ><button class="selecttemplate">Open</button></td>';
          templatecontent += '</tr>';
          
          
            });
            $('#templatetable').append(templatecontent);
            
        }
        //$('#load').fadeOut('slow');
        modal[0].style.display = "none";
      });
        } catch (error) {
          
        }

        $(document).on('click','.selecttemplate', function() {
           
          console.log($(this).parent().parent().children('#templateid'));  
          var id = $(this).parent().parent().children('#templateid')[0].innerHTML;
          console.log(id);  
          TemplateDataVar.TemplateID = id;
          TemplateDataVar.TemplateRecepientCount = reciverlist;
          console.log(TemplateDataVar);
          window.location.hash = "#/admin/selecttemplaterecepients";

				});
				

    }
    else{
      
      window.location.hash = "#/auth/login";
      
    }
  });




  


  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="mt--7 mx-6">
        <div className="modal">
        <div className="modal-content">
          <div><p>Please wait while we fetch your details.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>
          {/* Table */}
          <Row className="pb-8">
            <div className="col">
              <Card className="shadow pb-6">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Templates</h3>
                  <Nav className="justify-content-end" pills>
                        
                        <NavItem>
                          <NavLink className="py-2 px-1"   to="/admin/selecttemplate" tag={Link}>
                            <Button
                            color="primary"
                            >
                            <span className="d-none d-md-block">Add Template</span>
                            <span className="d-md-none">></span>
                            </Button>
                            
                          </NavLink>
                        </NavItem>
                      </Nav>
                </CardHeader>
                <CardBody className="">
                  <Row>
                
        <Col lg="12">
        <Table className="align-items-center table-flush" id="templatetable" responsive>
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col">Document Name</th>
                      <th scope="col">Document ID</th>
                      <th scope="col">Recepients</th>
                      <th scope="col">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
            </Col>
             </Row>
             </CardBody>
                
              </Card>
            </div>
          </Row>
          </div>
      </>
    );
  }
}

export default Templates;
