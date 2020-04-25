
import React from "react";
import classnames from "classnames";
import "./selecttemplaterecepients.css";
import $ from 'jquery';

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
  Container,
  FormGroup,
  Input,
  Col,
  Row,
	TabContent,
	TabPane,
	NavItem,
  NavLink,
  Button,
	Nav,
  UncontrolledTooltip,
  CardBody
} from "reactstrap";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";

require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/disable-selection');

var firebase = require('firebase');

class SelectTemplateRecepients extends React.Component {
  
    
    componentDidMount(){
		var modal = document.querySelectorAll(".modal")

		var Email = {
			send: function(a) {
				return new Promise(function(n, e) {
					// eslint-disable-next-line no-unused-expressions
					a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send";
					var t = JSON.stringify(a);
					Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function(e) {
						n(e)
					})
				})
			},
			ajaxPost: function(e, n, t) {
				var a = Email.createCORSRequest("POST", e);
				// eslint-disable-next-line no-unused-expressions
				a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function() {
					var e = a.responseText;
					null != t && t(e)
				}, a.send(n)
			},
			ajax: function(e, n) {
				var t = Email.createCORSRequest("GET", e);
				// eslint-disable-next-line no-unused-expressions
				t.onload = function() {
					var e = t.responseText;
					null != n && n(e)
				}, t.send()
			},
			createCORSRequest: function(e, n) {
				var t = new XMLHttpRequest();
				return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XMLHttpRequest()).open(e, n) : t = null, t
			}
		};


		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
		var count = 0;
		var url = '';
		var docid = TemplateDataVar.TemplateID;
		var userid = user.uid;
		var email = '';
		var docname = '';
		var people = []
		var colorArray = ['#E6EE9C', '#B6EDD8', '#FFCDD3', '#90CAF9', '#E1BEE7', '#A5D6A7', '#B3E2E3', '#BCAAA4', '#E0E0E0', '#FFAB00', '#64DD17', '#00B8D4', '#00BFA5']


		$( function() {
			$( "#stsortable" ).sortable();
			$( "#stsortable" ).disableSelection();
		  } );

		$( "#stappend-btn" ).click(function() {
			
				var recepientName = document.getElementById('strecepient-input-name').value;
				var recepientEmail = document.getElementById('strecepient-input-email').value;
				var recepientoptionselect = document.getElementById('strecepientoptionselect');
				var recepientoption = recepientoptionselect.options[recepientoptionselect.selectedIndex].value;
				if( recepientoption == 'Needs to View' || recepientoption == 'Recieves a Copy'){
					if(recepientName == '' || recepientEmail ==''){
						alert('Please enter all details.');
					}
					else{
						var li = document.createElement('li');
						li.innerHTML='<div class="p-2 rcard" id="strcard"><input class="form-control-alternative p-3 inputr" id="strecepient-name" placeholder="'+recepientName+'" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-email" placeholder="'+recepientEmail+'" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-option" placeholder="'+recepientoption+'" type="text" disabled/><button class="buttonr delete">x</button></div>';
						$( "#stsortable" ).append(li);
						document.getElementById('strecepient-input-name').value = '';
						document.getElementById('strecepient-input-email').value = '';
					}
				}
				else if (count < TemplateDataVar.TemplateRecepientCount ){

				if(recepientName == '' || recepientEmail ==''){
					alert('Please enter all details.');
				}
				else{
					var li = document.createElement('li');
					li.innerHTML='<div class="p-2 rcard" id="strcard"><input class="form-control-alternative p-3 inputr" id="strecepient-name" placeholder="'+recepientName+'" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-email" placeholder="'+recepientEmail+'" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-option" placeholder="'+recepientoption+'" type="text" disabled/><button class="buttonr delete">x</button></div>';
					$( "#stsortable" ).append(li);
					document.getElementById('strecepient-input-name').value = '';
					document.getElementById('strecepient-input-email').value = '';
					count = count + 1;
				}
			}
			else{
				alert('Sorry all recepient positions have been filled');
			}
			
			
		});

		$(document).on('click','.delete', function() {
			$(this).parent().parent().remove();  
			console.log($(this).parent().children('#strecepient-name').attr("placeholder"));  
		});

		
		Array.prototype.pushWithReplace = function(o,k){
		var fi = this.findIndex(f => f[k] === o[k]);
		fi != -1 ? this.splice(fi,1,o) : this.push(o);
		return this;
		};
		
		

		$( "#sts-btn" ).click(function() {
			modal[0].style.display = "block";
			var today = new Date().toLocaleString().replace(",","");
			url = 'https://pappayasign.surge.sh/#/admin/sign?id=' + encodeURIComponent(docid) + '&type=db&u=' + userid;
			people = [];
			var listItems = $("#stsortable li");
			if(listItems.length == 0){
				alert('There are no recepeints, Please add recepients');
				TemplateDataVar.TemplateRecepientArray = people;
			}
			else{
				listItems.each(function(li) {
					var recepientN = $(this).children('#strcard').children('#strecepient-name').attr("placeholder");
					var recepientE = $(this).children('#strcard').children('#strecepient-email').attr("placeholder");
					var recepientO = $(this).children('#strcard').children('#strecepient-option').attr("placeholder");
					people.pushWithReplace({name: recepientN, email: recepientE, option:recepientO}, "email");
					
				});
				console.log(people);
				TemplateDataVar.TemplateRecepientArray = people;
				console.log(TemplateDataVar);
			}

			var storageRef = firebase.storage().ref();
				storageRef.child(userid + '/Templates/'+docid+'.pdf').getDownloadURL().then(function(url)     {
					// `url` is the download URL for 'images/stars.jpg'
					var blob = '';
				// This can be downloaded directly:
				var xhr = new XMLHttpRequest();
					xhr.responseType = 'blob';
					xhr.onload = function(event) {
					blob = xhr.response;
					var storageRef = firebase.storage().ref(userid + '/Documents/'+docid+'.pdf');
						var task = storageRef.put(blob);
						task.on('state_changed', function progress(snapshot) {
						console.log('done')
						
						}, function error(err) {
					
							console.log(err)
						},function complete() {
							console.log('Complete');
							modal[0].style.display = "none";
							window.location.hash = "#/admin/sendsuccess";
						}
						);
					};
					xhr.open('GET', url);
					xhr.send();

					// Or inserted into an <img> element:
					
					
					
					}).catch(function(error) {
						//modal[0].style.display = "none";
					// Handle any errors
				});

			var leadsRef = firebase.database().ref(userid + '/Templates/'+ docid + '/Data/')
			console.log(leadsRef);
				leadsRef.once('value', function(snapshot) {
				snapshot.forEach(function(data, index){
				console.log('found ref');
				console.log(data.val());
				var jsondata = data.val()
				console.log(docid);
				console.log(jsondata);
				console.log(data.key);
				firebase.database().ref(userid + '/Documents/'+docid+'/Data/').child(data.key).set(jsondata);
				});
							
			})


			var leadsRef = firebase.database().ref(userid + '/Templates/'+ docid)
			console.log(leadsRef);
				leadsRef.once('value', function(snapshot) {
					var data = snapshot.val();
					email = data.OwnerEmail;
					docname = data.TemplateName;
					firebase.database().ref(userid + '/Documents/'+docid).child('OwnerEmail').set(data.OwnerEmail);
					firebase.database().ref(userid + '/Documents/'+docid).child('Status').set(data.Status);
					firebase.database().ref(userid + '/Documents/'+docid).child('DocumentName').set(data.TemplateName);
					firebase.database().ref(userid +  '/Documents/'+docid).child('Owner').set(userid);
					firebase.database().ref(userid +  '/Documents/'+docid).child('DateCreated').set(today);
         			 firebase.database().ref(userid +  '/Documents/'+docid).child('DateStatus').set(today);
				});

				people.forEach(function(item, index) {
					var recepientName = people[index].name;
					var recepientEmail = people[index].email;
					var recepientOption = people[index].option;
					var recepientColor = colorArray[index];
					if(recepientOption == 'Needs to Sign' || recepientOption == 'Needs to View'){
					console.log(recepientEmail + ',' + recepientName);
						var ref = firebase.database().ref('Users/');
						  ref.orderByChild('UserEmail').equalTo(recepientEmail).on("value", function(snapshotchild) {
							  console.log(snapshotchild);
							  snapshotchild.forEach(function(datarecep){
								var data = datarecep.val();
								console.log(data);
								var useridData = data.UserID;
								firebase.database().ref('Users/'+useridData+'/Requests/'+docid).child('DocumentName').set(docname);
								firebase.database().ref('Users/'+useridData+'/Requests/'+docid).child('DocumentID').set(docid);
								firebase.database().ref('Users/'+useridData+'/Requests/'+docid).child('From').set(userid);
								firebase.database().ref('Users/'+useridData+'/Requests/'+docid).child('FromEmail').set(email);
							  });
								
						  });
			
							Email.send({
								Host : "mail.pappaya.com",
								Username : "devsign@pappaya.com",
								Password : "Pappaya@2020",
								To : recepientEmail,
								From : "devsign@pappaya.com",
								Subject : "PappayaSign: Request Signing",
								Body : '<div><p>Hello '+recepientName+', We have a sign request for you.\nGo to this link:'+url+'</p><a target="_blank" href="'+url+'"><p>Click Here</p></a></div>'
							}).then(
							  message => {
								  firebase.database().ref(userid + '/Documents/'+docid+'/').child('Status').set('Waiting for Others');
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('RecepientName').set(recepientName);
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('DocumentName').set(docname);
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('RecepientEmail').set(recepientEmail);
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('RecepientColor').set(recepientColor);
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('RecepientOption').set(recepientOption);
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('RecepientStatus').set('Sent');
								  firebase.database().ref(userid + '/Documents/'+docid+'/Reciever/'+index).child('RecepientDateStatus').set(today);
								}
							);
						  
						  
							}
				});

				
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
		<div className="modal">
		<div className="modal-content">
			<div><p>Please wait while we send your document.</p><div className="lds-dual-ring"></div></div>
			
		</div>
		</div>
        <Container className="mt--7 pb-8">
          {/* Table */}
          <Row>
          
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Add Recepients</h3>
                </CardHeader>
               <CardBody>
			   <div >
  <div className="mb-4 mb-xl-0"><h5>Enter Recepients: </h5></div>
	<Row><Col lg="4"><FormGroup><Input className="form-control-alternative" id="strecepient-input-name" placeholder="Name" type="text"/></FormGroup></Col>
		<Col lg="4">
		<FormGroup>
		<Input
			className="form-control-alternative"
			id="strecepient-input-email"
			placeholder="Email Address"
			type="email"
		/>
		</FormGroup>
		</Col>
		<Col lg="4">
		<FormGroup>
		<select id="strecepientoptionselect" className="form-control  form-control-md" >
			<option value="Needs to Sign">Needs to Sign</option>
			<option value="Needs to View">Needs to View</option>
			<option value="Recieves a Copy">Recieves a Copy</option>
		</select>
		</FormGroup>
		</Col>
		
		<Col lg="12">
		<Button id="sts-btn" className="close-btn float-right m-2 px-5" > Finish</Button>
		<Button id="stappend-btn" className="close-btn float-right m-2 px-5" > Add</Button>
		
		</Col>
		</Row>
		
	
	</div>
	<hr className="my-4" />
			   <div id="strecepientdiv">
			   <ul id="stsortable">
				

				</ul>
				</div>

			   </CardBody>
                
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default SelectTemplateRecepients;
