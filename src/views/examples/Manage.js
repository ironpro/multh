
import React from "react";
import classnames from "classnames";
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
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Button,
  Container,
  FormGroup,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
  CardBody
} from "reactstrap";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";
import $ from 'jquery';
import DataVar from '../../variables/data';
import TemplateDataVar from '../../variables/templatedata';

var firebase = require('firebase');

class Tables extends React.Component {

  state = {
		tabs: 1
	  };
	  toggleNavs = (e, state, index) => {
		e.preventDefault();
		this.setState({
		  [state]: index
		});
    };
    
  componentDidMount(){
  
    try {
      var mainurl = document.location.hash,
      params = mainurl.split('?')[1].split('&'),
      data = {}, tmp;
        for (var i = 0, l = params.length; i < l; i++) {
      tmp = params[i].split('=');
      data[tmp[0]] = tmp[1];
        }
      var action = data.action;

      if(action === 'inbox'){
        var inboxbtn = document.getElementById('inboxbtn');
		    inboxbtn.click();
      }
      else if(action === 'sent'){
        var sentbtn = document.getElementById('sentbtn');
		    sentbtn.click();
      }
      else if(action === 'requests'){
        var actionrequiredbtn = document.getElementById('actionrequiredbtn');
		    actionrequiredbtn.click();
      }
      else if(action === 'completed'){
        var completedbtn = document.getElementById('completedbtn');
		    completedbtn.click();
      }
      
      } catch (error) {
      
      }

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

    var modal = document.querySelectorAll(".modal")
    modal[0].style.display = "block";
    var userid = "";
    var email='';
    var voiduserid = '';
    var voidfileid = '';
    var voidstatus = '';
    var deleteuserid = '';
    var deletefileid = '';
    var deletestatus = '';
    var droptoggle = 0;
    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

        userid=user.uid;
        console.log(userid);
        try {
          var leadsRef = firebase.database().ref('Users/'+userid)
			console.log('found ref');
		leadsRef.once('value', function(snapshot) {
			var Child = snapshot.val();
        email = Child.UserEmail; 

        inboxfunc();
        datafunc();
      
  });

        } catch (error) {
          
        }

    }
    else{
      
      window.location.hash = "#/auth/login";
      
    }
  });

  

  function inboxfunc(){
    modal[0].style.display = "block";
    $("#actionrequiredtable tbody tr").remove(); 
    $("#alltable tbody tr").remove(); 
    $("#deletedtable tbody tr").remove(); 
    $("#completedtable tbody tr").remove(); 
    var ref = firebase.database().ref('Users/'+userid+ '/Requests/');
        ref.once("value", function(snapshot) {
          if(snapshot.exists()){
            var allcontent = '';
            var deletedcontent = '';
            var completedcontent = '';
            var actionrequiredcontent = '';
            snapshot.forEach(function(data){
              var dataval = data.val();
              if( dataval.RecipientStatus == 'Void' || dataval.RecipientStatus == 'Need to Sign'){

                  allcontent +='<tr >';
                allcontent +='<th><input  type="checkbox"></th>';
                allcontent +='<td scope="row"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nTo: '+dataval.FromEmail+'</span></td>';
                allcontent += '<td id="datastatus">' + dataval.RecipientStatus + '</td>';
                allcontent += '<td id="datakey" hidden>' + data.key + '</td>';
                allcontent += '<td id="datauid" hidden>' + dataval.From + '</td>';
                allcontent += '<td id="datarecep" hidden>' + dataval.FromEmail + '</td>';
                allcontent += '<td >' + dataval.RecipientDateStatus + '</td>';
                allcontent+=`<td ><div class="btn-group">
                <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=`+data.key+`&type=db&u=`+dataval.From+`">SIGN</a></button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item move" type="button">Move</button>
                <button class="dropdown-item correct" type="button">Correct</button>
                <button class="dropdown-item create" type="button">Create a Copy</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                <button class="dropdown-item void" type="button">Void</button>
                <button class="dropdown-item history" type="button">History</button>
                <button class="dropdown-item export" type="button">Export as CSV</button>
                <button class="dropdown-item deletemanage" type="button">Delete</button>
                </div>
              </div></td >`
                allcontent += '</tr>';
                if(dataval.RecipientStatus == 'Need to Sign'){
                  actionrequiredcontent +='<tr >';
                  actionrequiredcontent +='<th><input  type="checkbox"></th>';
                  actionrequiredcontent +='<td scope="row"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nTo: '+dataval.FromEmail+'</span></td>';
                  actionrequiredcontent += '<td id="datastatus">' + dataval.RecipientStatus + '</td>';
                  actionrequiredcontent += '<td id="datakey" hidden>' + data.key + '</td>';
                  actionrequiredcontent += '<td id="datauid" hidden>' + dataval.From + '</td>';
                  actionrequiredcontent += '<td id="datarecep" hidden>' + dataval.FromEmail + '</td>';
                  actionrequiredcontent += '<td >' + dataval.RecipientDateStatus + '</td>';
                  actionrequiredcontent+=`<td ><div class="btn-group">
                  <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=`+data.key+`&type=db&u=`+dataval.From+`">SIGN</a></button>
                  <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                  <div class="dropdown-menu2" id="dropdown">
                  <button class="dropdown-item move" type="button">Move</button>
                  <button class="dropdown-item correct" type="button">Correct</button>
                  <button class="dropdown-item create" type="button">Create a Copy</button>
                  <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                  <button class="dropdown-item void" type="button">Void</button>
                  <button class="dropdown-item history" type="button">History</button>
                  <button class="dropdown-item export" type="button">Export as CSV</button>
                  <button class="dropdown-item deletemanage" type="button">Delete</button>
                  </div>
                </div></td >`
                 actionrequiredcontent += '</tr>';
                }
                
   
            }
            else if(dataval.RecipientStatus == 'Deleted'){
              deletedcontent +='<tr >';
              deletedcontent +='<th><input  type="checkbox"></th>';
              deletedcontent +='<td scope="row"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nTo: '+dataval.FromEmail+'</span></td>';
              deletedcontent += '<td id=datastatus>' + dataval.RecipientStatus + '</td>';
              deletedcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              deletedcontent += '<td id="datauid" hidden>' + dataval.From + '</td>';
              deletedcontent += '<td id="datarecep" hidden>' + dataval.FromEmail + '</td>';
              deletedcontent += '<td >' + dataval.RecipientDateStatus + '</td>';
              deletedcontent+=`<td ><div class="btn-group">
                <button type="button" class="btn btn-primary restore">CONTINUE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Continue</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                </div>
                </div></td >`
              deletedcontent += '</tr>';
            }
            else if(dataval.RecipientStatus == 'Completed'){
              completedcontent +='<tr >';
              completedcontent +='<th><input  type="checkbox"></th>';
              completedcontent +='<td scope="row"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nTo: '+dataval.FromEmail+'</span></td>';
              completedcontent += '<td id="datastatus">' + dataval.RecipientStatus + '</td>';
              completedcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              completedcontent += '<td id="datauid" hidden>' + dataval.From + '</td>';
              completedcontent += '<td id="datarecep" hidden>' + dataval.FromEmail + '</td>';
              completedcontent += '<td >' + dataval.RecipientDateStatus + '</td>';
              completedcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=`+data.key+`&type=db&u=`+dataval.From+`">SIGN</a></button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
             completedcontent += '</tr>';
            }
            

            });
            $('#alltable').append(allcontent);
            $('#deletedtable').append(deletedcontent);
            $('#actionrequiredtable').append(actionrequiredcontent);
            $('#completedtable').append(completedcontent);
            
        }
        
      });
  }



  function datafunc(){
    modal[0].style.display = "block";
    $("#senttable tbody tr").remove();   
    $("#waitingtable tbody tr").remove(); 
    $("#expiringtable tbody tr").remove(); 
    $("#authtable tbody tr").remove(); 
    var ref = firebase.database().ref(userid+'/Documents');
        ref.once("value", function(snapshot) {
          if(snapshot.exists()){
            var sentcontent = '';
            var draftcontent = '';
            var deletedcontent = '';
            var completedcontent = '';
            var waitingcontent = '';
            var authcontent = '';
            var expiringcontent = '';
            snapshot.forEach(function(data){
          var val = data.val();
          var reciverlist = '';
          try {
            val.Reciever.forEach(function(reciever, index){
              var id = index + 1;
              reciverlist = reciverlist + ' ' +reciever.RecepientEmail + '\n';
            
          });
          } catch (error) {
            
          }
          
          if(val.Status == 'Sent' || val.Status == 'Waiting for Others' || val.Status == 'Declined' || val.Status == 'Void' || val.Status == 'Authentication Failed' || val.Status == 'Correcting' ||  val.Status == 'Completed' ||  val.Status == 'Draft'){
            if(val.Status == 'Waiting for Others'){
              waitingcontent +='<tr >';
              waitingcontent +='<th><input  type="checkbox"></th>';
              waitingcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              waitingcontent += '<td id=datastatus>' + val.Status + '</td>';
              waitingcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              waitingcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              waitingcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              waitingcontent += '<td >' + val.DateStatus + '</td>';
              waitingcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
              waitingcontent += '</tr>';

              sentcontent +='<tr >';
            sentcontent +='<th><input class="primary" type="checkbox"></th>';
            sentcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
            sentcontent += '<td id=datastatus>' + val.Status + '</td>';
            sentcontent += '<td id="datakey" hidden>' + data.key + '</td>';
            sentcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
            sentcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
            sentcontent += '<td >' + val.DateStatus + '</td>';
            sentcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            sentcontent += '</tr>';
            }
            else if(val.Status == 'Correcting'){
              sentcontent +='<tr >';
              sentcontent +='<th><input  type="checkbox"></th>';
              sentcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              sentcontent += '<td id=datastatus>' + val.Status + '</td>';
              sentcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              sentcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              sentcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              sentcontent += '<td >' + val.DateStatus + '</td>';
              sentcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary correct">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            sentcontent += '</tr>';
            }
            else if(val.Status == 'Void'){
              sentcontent +='<tr >';
              sentcontent +='<th><input  type="checkbox"></th>';
              sentcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              sentcontent += '<td id=datastatus>' + val.Status + '</td>';
              sentcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              sentcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              sentcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              sentcontent += '<td >' + val.DateStatus + '</td>';
              sentcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary move">MOVE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            sentcontent += '</tr>';
            }
            else if(val.Status == 'Draft'){
              
              draftcontent +='<tr >';
              draftcontent +='<th><input  type="checkbox"></th>';
              draftcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              draftcontent += '<td id=datastatus>' + val.Status + '</td>';
              draftcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              draftcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              draftcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              draftcontent += '<td >' + val.DateStatus + '</td>';
              draftcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary correct">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            draftcontent += '</tr>';
            }
            else if(val.Status == 'Authentication Failed'){
              authcontent +='<tr >';
              authcontent +='<th><input  type="checkbox"></th>';
              authcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              authcontent += '<td id=datastatus>' + val.Status + '</td>';
              authcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              authcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              authcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              authcontent += '<td >' + val.DateStatus + '</td>';
              authcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
              </div></td >`
              authcontent += '</tr>';

              sentcontent +='<tr >';
            sentcontent +='<th><input class="primary" type="checkbox"></th>';
            sentcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
            sentcontent += '<td id=datastatus>' + val.Status + '</td>';
            sentcontent += '<td id="datakey" hidden>' + data.key + '</td>';
            sentcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
            sentcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
            sentcontent += '<td >' + val.DateStatus + '</td>';
            sentcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            sentcontent += '</tr>';
            }
            else if(val.Status == 'Expiring Soon'){
              expiringcontent +='<tr >';
              expiringcontent +='<th><input  type="checkbox"></th>';
              expiringcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              expiringcontent += '<td id=datastatus>' + val.Status + '</td>';
              expiringcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              expiringcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              expiringcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              expiringcontent += '<td >' + val.DateStatus + '</td>';
              expiringcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
              </div></td >`
              expiringcontent += '</tr>';

              sentcontent +='<tr >';
            sentcontent +='<th><input class="primary" type="checkbox"></th>';
            sentcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
            sentcontent += '<td id=datastatus>' + val.Status + '</td>';
            sentcontent += '<td id="datakey" hidden>' + data.key + '</td>';
            sentcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
            sentcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
            sentcontent += '<td >' + val.DateStatus + '</td>';
            sentcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            sentcontent += '</tr>';
            }
            else if(val.Status == 'Completed'){
              completedcontent +='<tr >';
              completedcontent +='<th><input  type="checkbox"></th>';
              completedcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              completedcontent += '<td id=datastatus>' + val.Status + '</td>';
              completedcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              completedcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              completedcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              completedcontent += '<td >' + val.DateStatus + '</td>';
              completedcontent+=`<td ><div class="btn-group">
                <button type="button" class="btn btn-primary move">MOVE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Forward</button>
                <button class="dropdown-item create" type="button">Create a Copy</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                <button class="dropdown-item history" type="button">History</button>
                <button class="dropdown-item export" type="button">Export as CSV</button>
                <button class="dropdown-item deletemanage" type="button">Delete</button>
                </div>
                </div></td >`
              completedcontent += '</tr>';

              sentcontent +='<tr >';
            sentcontent +='<th><input class="primary" type="checkbox"></th>';
            sentcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
            sentcontent += '<td id=datastatus>' + val.Status + '</td>';
            sentcontent += '<td id="datakey" hidden>' + data.key + '</td>';
            sentcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
            sentcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
            sentcontent += '<td >' + val.DateStatus + '</td>';
            sentcontent+=`<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
            sentcontent += '</tr>';
            }
  
          }
          else if(val.Status == 'Deleted'){
            deletedcontent +='<tr >';
              deletedcontent +='<th><input  type="checkbox"></th>';
              deletedcontent +='<td scope="row"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
              deletedcontent += '<td id=datastatus>' + val.Status + '</td>';
              deletedcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              deletedcontent += '<td id="datarecep" hidden>' + reciverlist + '</td>';
              deletedcontent += '<td id="datauid" hidden>' + val.Owner + '</td>';
              deletedcontent += '<td >' + val.DateStatus + '</td>';
              deletedcontent+=`<td ><div class="btn-group">
                <button type="button" class="btn btn-primary restore">CONTINUE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Continue</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                </div>
                </div></td >`
              deletedcontent += '</tr>';
          }
          
          
          
          
            });
            $('#senttable').append(sentcontent);
            $('#draftstable').append(draftcontent);
            $('#deletedtable').append(deletedcontent);
            $('#completedtable').append(completedcontent);
            $('#waitingtable').append(waitingcontent);
            $('#expiringtable').append(expiringcontent);
            $('#authtable').append(authcontent);
            
        }
        //$('#load').fadeOut('slow');
        modal[0].style.display = "none";
      });
  }



  $(document).on('click','.void', function() { 
    $('.dropdown-menu2').css({"display": "none"});
    try {
      console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
    voiduserid = $(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML; 
    voidfileid = $(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML; 
    voidstatus = $(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML;
    } catch (error) {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    voiduserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    voidfileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    voidstatus = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    }
    
    modal[3].style.display = "block"; 
    
  });

  $( "#managevoidapprovebtn" ).click(function() {
    modal[3].style.display = "none" 
    modal[2].style.display = "block" 
    var managevoidmessage = document.getElementById('managevoidmessage').value;
      if(managevoidmessage !== ''){
        firebase.database().ref(voiduserid + '/Documents/'+voidfileid+'/').child('Status').set('Void'); 

    var ref = firebase.database().ref(voiduserid + '/Documents/'+voidfileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          var dbpeople = [];
					dbpeople.push({name: data.RecepientName, email: data.RecepientEmail, option:data.RecepientOption});
          console.log(dbpeople);
          var userref = firebase.database().ref('Users/');
          userref.orderByChild('UserEmail').equalTo(data.RecepientEmail).once("value", function(snapshotchild) {
				  console.log(snapshotchild);
				  snapshotchild.forEach(function(datarecep){
          var data = datarecep.val();
          firebase.database().ref('Users/'+ datarecep.key +'/Requests/'+voidfileid+'/').child('RecipientStatus').set('Void'); 
          });
        });
          Email.send({
            Host : "mail.pappaya.com",
            Username : "devsign@pappaya.com",
            Password : "Pappaya@2020",
            To : data.RecepientEmail,
            From : "devsign@pappaya.com",
            Subject : "PappayaSign: Document Voided",
            Body : '<div><p>Hello '+data.RecepientName+', '+data.DocumentName+' Has been voided. \n\nReason:'+managevoidmessage+'</p></div>'
          }).then(
            message => {
              firebase.database().ref(voiduserid + '/Documents/'+voidfileid+'/Reciever/'+childdata.key+'/').child('RecepientStatus').set('Void');
              }
          );
           
        
        });
        console.log('resent');
        inboxfunc();
        datafunc();
        modal[2].style.display = "none"
      
			});
      }
      else{
        alert('Please provide a reason, So we could let your recepients know.')
      }

  });

  $( "#managevoidcancelbtn" ).click(function() {
    modal[3].style.display = "none";
  });


  $(document).on('click','.deletemanage', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    try {
      console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
    deleteuserid = $(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML; 
    deletefileid = $(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML; 
    deletestatus = $(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML;
    } catch (error) {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    deleteuserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    deletefileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    deletestatus = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    }
    
    modal[4].style.display = "block";
    
  });


  $( "#managedeleteapprovebtn" ).click(function() {
    modal[4].style.display = "none" 
    modal[2].style.display = "block" 
    firebase.database().ref(deleteuserid + '/Documents/'+deletefileid+'/').child('Status').set('Deleted'); 

    var ref = firebase.database().ref(deleteuserid + '/Documents/'+deletefileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          var dbpeople = [];
					dbpeople.push({name: data.RecepientName, email: data.RecepientEmail, option:data.RecepientOption});
          console.log(dbpeople);
          var userref = firebase.database().ref('Users/');
          userref.orderByChild('UserEmail').equalTo(data.RecepientEmail).on("value", function(snapshotchild) {
				  console.log(snapshotchild);
				  snapshotchild.forEach(function(datarecep){
          var data = datarecep.val();
          firebase.database().ref('Users/'+ datarecep.key +'/Requests/'+deletefileid+'/').child('RecipientStatus').set('Deleted'); 
          });
        });
        firebase.database().ref(deleteuserid + '/Documents/'+deletefileid+'/Reciever/'+childdata.key+'/').child('RecepientStatus').set('Deleted');
           
        
        });
        inboxfunc();
        datafunc();
        modal[2].style.display = "none" 
			});

  });

  $( "#managedeletecancelbtn" ).click(function() {
    modal[4].style.display = "none";
    modal[2].style.display = "none";
  });


  $(document).on('click','.export', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    modal[2].style.display = "block" 
    console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
    var exportuserid = $(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML; 
    var recepients = $(this).parent().parent().parent().parent().children('#datarecep')[0].innerHTML; 

    var ref = firebase.database().ref(exportuserid + '/Documents/'+fileid+'/');  
			ref.once("value", function(snapshotchild) {
				var data = snapshotchild.val();
          console.log(data);
          var datarray = [];
          datarray.push({DateCreated: data.DateCreated, DateSent: data.DateSent, DateCreated:data.DateCreated , DateStatus: data.DateStatus, DocumentName: data.DocumentName, Owmer:data.Owner , OwnerEmail: data.OwnerEmail,  Recepients: data.Recepients, Status: data.Status });
          console.log(datarray);

          console.log(CSV(datarray, fileid));
          modal[2].style.display = "none";
      });

      
  });
    
  function CSV(array, csvfileid) {
    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join(",") + "\n";

    // Add the rows
    array.forEach(function(obj){
        result += keys.map(k => obj[k]).join(",") + "\n";
    });

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);
    hiddenElement.target = '_blank';
    hiddenElement.download = ''+csvfileid+'.csv';
    hiddenElement.click();

    return result;
    
}


  $(document).on('click','.action', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    if(droptoggle === 0){
    $(this).parent().children('#dropdown')[0].style.display = 'block';
    droptoggle = 1;
    }
    else if(droptoggle === 1){
      droptoggle = 0;
      $(this).parent().children('#dropdown')[0].style.display = 'none';
    }
  });


  $(document).on('click','.correct', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    modal[2].style.display = "block"
    try {
      console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
    var correctuserid = $(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML;
    } catch (error) {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    var correctuserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    } 
    
    var docname= '';
    firebase.database().ref(correctuserid + '/Documents/'+fileid+'/').child('Status').set('Correcting'); 
    var ref = firebase.database().ref(correctuserid + '/Documents/'+fileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          var dbpeople = [];
					dbpeople.push({name: data.RecepientName, email: data.RecepientEmail, option:data.RecepientOption});
          console.log(dbpeople);
          DataVar.RecepientArray = dbpeople;
          docname = data.DocumentName;
          firebase.database().ref(correctuserid + '/Documents/'+fileid+'/Reciever/'+childdata.key+'/').child('RecepientStatus').set('Correcting'); 
          
        });
        
        modal[2].style.display = "none"
        var wurl = '#/admin/uploadsuccess?id='+fileid+'&u='+correctuserid+'&docname='+docname+'&action=correct'; 
        window.location.hash = wurl;
      });
      
  });


  $(document).on('click','.create', function() { 
    $('.dropdown-menu2').css({"display": "none"}); 
    modal[2].style.display = "block" 
    try {
      console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
    var createuserid = $(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML;
    } catch (error) {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    var createuserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    }
    
    var docname= '';
    var ref = firebase.database().ref(createuserid + '/Documents/'+fileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          var dbpeople = [];
					dbpeople.push({name: data.RecepientName, email: data.RecepientEmail, option:data.RecepientOption});
          console.log(dbpeople);
          DataVar.RecepientArray = dbpeople;
          docname = data.DocumentName;
          
        });

        var ref = firebase.database().ref(createuserid + '/Documents/'+fileid+'/DocumentName/');  
			ref.once("value", function(snapshotchild) {
        var data = snapshotchild.val();
        var storageRef = firebase.storage().ref();
				storageRef.child(createuserid + '/Documents/'+fileid+'.pdf').getDownloadURL().then(function(url)     {
					// `url` is the download URL for 'images/stars.jpg'
					var blob = '';
				// This can be downloaded directly:
				var xhr = new XMLHttpRequest();
					xhr.responseType = 'blob';
					xhr.onload = function(event) {
          blob = xhr.response;
          DataVar.DocName = data;
          DataVar.DataURI = blob;
          modal[2].style.display = "none"
        var wurl = '#/admin/uploadsuccess?id='+fileid+'&u='+createuserid+'&docname='+docname+'&action=create'; 
        window.location.hash = wurl;
					};
					xhr.open('GET', url);
					xhr.send();

					}).catch(function(error) {
						//modal[0].style.display = "none";
					// Handle any errors
				});
      });
        
      });
      
  });


  $(document).on('click','.savetemplate', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    modal[2].style.display = "block" 
    try {
      console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
    var templateuserid = $(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML;
    } catch (error) {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    var templateuserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    }
    
    var docname= ''; 
    var ref = firebase.database().ref(templateuserid + '/Documents/'+fileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          var dbpeople = [];
					dbpeople.push({name: data.RecepientName, email: data.RecepientEmail, option:data.RecepientOption});
          console.log(dbpeople);
          TemplateDataVar.TemplateID = fileid;
          TemplateDataVar.TemplateUserID = templateuserid;
          TemplateDataVar.TemplateRecepientCount = dbpeople.length;
          TemplateDataVar.TemplateRecepientArray = dbpeople;
          
        });
        
        modal[2].style.display = "none"
        var wurl = '#/admin/saveastemplate'; 
        window.location.hash = wurl;
      });
      
  });

  

  $(document).on('click','.resend', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    modal[1].style.display = "block";
    try {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    var resenduserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    } catch (error) {
      console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
    var resenduserid = $(this).parent().parent().parent().children('#datauid')[0].innerHTML; 
    var fileid = $(this).parent().parent().parent().children('#datakey')[0].innerHTML; 
    var status = $(this).parent().parent().parent().children('#datastatus')[0].innerHTML;
    }
    
    var url = 'https://pappayasign.surge.sh/#/admin/sign?id='+fileid+'&type=db&u='+resenduserid+''; 
    var ref = firebase.database().ref(resenduserid + '/Documents/'+fileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          console.log(data.RecepientStatus);
          if(data.RecepientStatus === 'Sent'){
            var dbpeople = [];
            dbpeople.push({name: data.RecepientName, email: data.RecepientEmail, option:data.RecepientOption});
            console.log(dbpeople);
            Email.send({
              Host : "mail.pappaya.com",
              Username : "devsign@pappaya.com",
              Password : "Pappaya@2020",
              To : data.RecepientEmail,
              From : "devsign@pappaya.com",
              Subject : "PappayaSign",
              Body : '<div><p>Hello '+data.RecepientName+', We have a sign request for you.\nGo to this link:'+url+'</p><a target="_blank" href="'+url+'"><p>Click Here</p></a></div>'
            }).then(
              message => {
                
              }
            );
          }
          
        });
        inboxfunc();
        datafunc();
        modal[1].style.display = "none"
        console.log('resent');
			});  
  });

  $( "#startnowbtn" ).click(function() {
    window.location.hash = '#/admin/startdrop';
  });


  


  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="mt--8 mx-4">
        <div className="modal">
        <div className="modal-content">
          <div><p>Please wait while we fetch your details.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>

      <div className="modal">
        <div className="modal-content">
          <div><p>Sending.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>

      <div className="modal">
        <div className="modal-content">
          <div><p>Please wait.</p><div className="lds-dual-ring"></div></div>
        
        </div>
      </div>


      <div className="modal">
        <div className="modal-content">
        <div >
        <div className="mb-4 mb-xl-0"><h5>By voiding this envelope, recipients can no longer view it or sign enclosed documents. Recipients will receive an email notification, which includes your reason for voiding the envelope. </h5></div>
        <Row>
          
        <Col lg="12">
        <FormGroup>
        <span className="emaillabelspan"><strong>*Reason for voiding document.</strong></span>
          <Input
            className="form-control-alternative"
            id="managevoidmessage"
            placeholder="Email message"
            type="textarea"
            rows="3"
          />
          </FormGroup>
          </Col>
          
          <Col lg="6">
          <Button id="managevoidapprovebtn" className="close-btn float-right px-4" > Void</Button>
          </Col>
          <Col lg="6">
          <Button id="managevoidcancelbtn" className="cancel-btn float-left px-4" > Cancel</Button>
          </Col>
          </Row>
          
        
        </div>
        
        </div>
      </div>


      <div className="modal">
        <div className="modal-content">
        <div >
        <div className="mb-4 mb-xl-0"><h5>Are you sure you want to delete this document? Deleting your in progress envelopes will void them and notify current recipients of the changes. You can find all your deleted envelopes in your Deleted bin for a short time before they're removed permanently. </h5></div>
        <Row>          
          <Col lg="6">
          <Button id="managedeleteapprovebtn" className="close-btn float-right px-4" > Delete</Button>
          </Col>
          <Col lg="6">
          <Button id="managedeletecancelbtn" className="cancel-btn float-left px-4" > Cancel</Button>
          </Col>
          </Row>
          
        
        </div>
        
        </div>
      </div>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Manage</h3>
                </CardHeader>
                
                <CardBody className="bg-secondary">
                  <Row>
                <Col lg="3">
                <div id="managebtncontainer" className="managebtncontainer">
                <Button
                className="my-3 fullwidth p-2"
                color="primary"
                size="mg"
                type="button"
                id="startnowbtn"
              >
                Start Now
              </Button>

              <div className ="divider" id="customfieldscolumn">
              <div className="col my-3 p-2">
              <h6 className="text-uppercase text-gray ls-1 mb-3 pl-3 float-left">
              Envelope
              </h6>
              </div>
              <hr className="my-1" />
              </div>

             <Button
                aria-selected={this.state.tabs === 1}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 1
                })}
                onClick={e => this.toggleNavs(e, "tabs", 1)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="inboxbtn"
                outline
              >
              <i className="material-icons" >inbox</i> 
                Inbox
              </Button>

              <Button
                aria-selected={this.state.tabs === 2}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 2
                })}
                onClick={e => this.toggleNavs(e, "tabs", 2)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="sentbtn"
                outline
              >
                <i className="material-icons" >send</i> 
                Sent
              </Button>

              <Button
                aria-selected={this.state.tabs === 3}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 3
                })}
                onClick={e => this.toggleNavs(e, "tabs", 3)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="draftsbtn"
                outline
              >
                <i className="material-icons" >drafts</i> 
                Drafts
              </Button>

            
              <Button
                aria-selected={this.state.tabs === 4}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 4
                })}
                onClick={e => this.toggleNavs(e, "tabs", 4)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="deletedbtn"
                outline
              >
                <i className="material-icons" >delete</i> 
                Deleted
              </Button>

              <div className ="divider" id="customfieldscolumn">
              <div className="col my-3 p-2">
              <h6 className="text-uppercase text-gray ls-1 mb-3 pl-3 float-left">
              Quick Views
              </h6>
              </div>
              <hr className="my-1" />
              </div>

              <Button
                aria-selected={this.state.tabs === 5}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 5
                })}
                onClick={e => this.toggleNavs(e, "tabs", 5)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="waitingbtn"
                outline
              >
                <i className="material-icons" >query_builder</i> 
                Waiting for Others
              </Button>
              
              <Button
                aria-selected={this.state.tabs === 6}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 6
                })}
                onClick={e => this.toggleNavs(e, "tabs", 6)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="actionrequiredbtn"
                outline
              >
              <i className="material-icons" >error</i> 
                Action Required
              </Button>
              <Button
                aria-selected={this.state.tabs === 7}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 7
                })}
                onClick={e => this.toggleNavs(e, "tabs", 7)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="completedbtn"
                outline
              >
                <i className="material-icons" >done</i> 
                Completed
              </Button>
              <Button
                aria-selected={this.state.tabs === 8}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 8
                })}
                onClick={e => this.toggleNavs(e, "tabs", 8)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="expiringbtn"
                outline
              >
                <i className="material-icons" >error</i> 
                Expiring Soon
              </Button>
              <Button
                aria-selected={this.state.tabs === 9}
                className={classnames("my-1 fullwidth", {
                  active: this.state.tabs === 9
                })}
                onClick={e => this.toggleNavs(e, "tabs", 9)}
                href="#pablo"
                color="primary"
                size="sm"
                type="button"
                id="authbtn"
                outline
              >
                <i className="material-icons" >warning</i> 
                Authentication Failed
              </Button>
              </div>
        </Col>
        <Col lg="9">
            <TabContent activeTab={"tabs" + this.state.tabs} id="tabcontent" className="managetabcontent">
              <TabPane tabId="tabs1" className="managetabpane">
              <Table className=" align-items-center table-flush" id="alltable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="tabs2" className="managetabpane">
              <Table className="align-items-center table-flush" id="senttable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>

              <TabPane tabId="tabs3" className="managetabpane">
              <Table className="align-items-center table-flush" id="draftstable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
              
              <TabPane tabId="tabs4" className="managetabpane">
              <Table className="align-items-center table-flush" id="deletedtable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="tabs5" className="managetabpane">
              <Table className="align-items-center table-flush" id="waitingtable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="tabs6" className="managetabpane">
              <Table className="align-items-center table-flush" id="actionrequiredtable" responsive>
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="tabs7" className="managetabpane">
              <Table className="align-items-center table-flush" id="completedtable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="tabs8" className="managetabpane">
              <Table className="align-items-center table-flush" id="expiringtable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
              <TabPane tabId="tabs9" className="managetabpane">
              <Table className="align-items-center table-flush" id="authtable">
                  <thead className="thead-primary">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last Change</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  </tbody>
                </Table>
              </TabPane>
            </TabContent>
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

export default Tables;
