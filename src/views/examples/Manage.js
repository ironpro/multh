
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
    var unifileid = '';
    var uniid = '';
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
                allcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nFrom: '+dataval.FromEmail+'</span></td>';
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
                  actionrequiredcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nFrom: '+dataval.FromEmail+'</span></td>';
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
              deletedcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nFrom: '+dataval.FromEmail+'</span></td>';
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
              completedcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+dataval.DocumentName+ '\nFrom: '+dataval.FromEmail+'</span></td>';
              completedcontent += '<td id="datastatus">' + dataval.RecipientStatus + '</td>';
              completedcontent += '<td id="datakey" hidden>' + data.key + '</td>';
              completedcontent += '<td id="datauid" hidden>' + dataval.From + '</td>';
              completedcontent += '<td id="datarecep" hidden>' + dataval.FromEmail + '</td>';
              completedcontent += '<td >' + dataval.RecipientDateStatus + '</td>';
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
              waitingcontent +='<td scope="row" class="rowselect" ><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
            sentcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              sentcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              sentcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              draftcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              authcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
            sentcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              expiringcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
            sentcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              completedcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
            sentcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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
              deletedcontent +='<td scope="row" class="rowselect"><span className="mb-0 text-sm">'+val.DocumentName+ '\nTo: '+reciverlist+'</span></td>';
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


  $(document).on('click','.rowselect', function() { 
    $('.dropdown-menu2').css({"display": "none"});
      modal[2].style.display = "block";
      document.getElementById('managebody').style.display= "none";
      document.getElementById('detailbody').style.display= "block";
      console.log($(this).parent().children('#datakey')[0].innerHTML);
    console.log($(this).parent().children('#datauid')[0].innerHTML);
    console.log($(this).parent().children('#datastatus')[0].innerHTML);
    var rowselectuserid = $(this).parent().children('#datauid')[0].innerHTML; 
    var rowselectfileid = $(this).parent().children('#datakey')[0].innerHTML; 
    var rowselectstatus = $(this).parent().children('#datastatus')[0].innerHTML;
    unifileid = rowselectfileid;
    uniid = rowselectuserid;
    
    var ref = firebase.database().ref(rowselectuserid + '/Documents/'+rowselectfileid+'/');  
			ref.once("value", function(snapshotchild) {
          var data = snapshotchild.val();
         
            var reciverlistrow = '';
            try {
              data.Reciever.forEach(function(reciever, index){
                var id = index + 1;
                reciverlistrow = reciverlistrow + ' ' +reciever.RecepientEmail + ',';

                var li = document.createElement('li');
            li.innerHTML=`<div class="rcardmanage">
            <div class="managelabelspan">
            <strong><span  id="summary-recepient-name">Name: `+reciever.RecepientName+`</span></strong>
            </div>
            <div class="managelabelspan">
            <span  id="summary-recepient-name">`+reciever.RecepientEmail+`</span>
            </div>
            <div class="managelabelspan">
            <span  id="summary-recepient-name">Action: `+reciever.RecepientOption+`</span>
            </div>
            <div class="managelabelspan">
            <span  id="summary-recepient-name">Status: `+reciever.RecepientStatus+`</span>
            </div>
            </div>`;
            $( "#managerecepientstable" ).append(li);
              
            });
            document.getElementById('detailsubject').innerHTML = data.DocumentName;
            document.getElementById('detailid').innerHTML = rowselectfileid;
            document.getElementById('detailsent').innerHTML = data.DateSent;
            document.getElementById('detailcreate').innerHTML = data.DateCreated;
            document.getElementById('detailholder').innerHTML = data.OwnerEmail;
            document.getElementById('detailrecepients').innerHTML = reciverlistrow;
            document.getElementById('detailstatus').innerHTML = data.Status;
            document.getElementById('detailstatusdate').innerHTML = data.DateStatus;
            modal[2].style.display = "none";
  
            } catch (error) {
              modal[2].style.display = "none";
            }
        });

 
    
  });


  $( "#detailbackbtn" ).click(function() {
    document.getElementById('managebody').style.display= "block";
      document.getElementById('detailbody').style.display= "none";
      $( "#managerecepientstable li" ).remove();
      $( "#managerecepientstable" ).innerHTML = '';
      document.getElementById('detailsubject').innerHTML = '';
      document.getElementById('detailid').innerHTML = '';
      document.getElementById('detailsent').innerHTML = '';
      document.getElementById('detailcreate').innerHTML = '';
      document.getElementById('detailholder').innerHTML = '';
      document.getElementById('detailrecepients').innerHTML = '';
      document.getElementById('detailstatus').innerHTML = '';
      document.getElementById('detailstatusdate').innerHTML = '';
  });

  $( "#detaildownloadbtn" ).click(function() {
    modal[2].style.display = "block"
    console.log(uniid);
    console.log(unifileid);
    var storageRef = firebase.storage().ref();
		storageRef.child(uniid + '/Documents/'+unifileid+'.pdf').getDownloadURL().then(function(url)     {
		    // `url` is the download URL for 'images/stars.jpg'

		   // This can be downloaded directly:
		   var xhr = new XMLHttpRequest();
		    xhr.responseType = 'blob';
		    xhr.onload = function(event) {
        var blob = xhr.response;
        console.log(blob);
        var blobUrl = URL.createObjectURL(blob);
        var link = document.createElement("a"); 
        link.href = blobUrl;
        link.style = "display: none";
        link.download = ""+unifileid+".pdf";
        link.click();
        modal[2].style.display = "none"
		    };
		    xhr.open('GET', url);
		    xhr.send();

        console.log(url);
			
		     }).catch(function(error) {
          modal[2].style.display = "none"
		     // Handle any errors
    });
    modal[2].style.display = "none"
  });


  $( "#detailprintbtn" ).click(function() {
    modal[2].style.display = "block"
    console.log(uniid);
    console.log(unifileid);
    var storageRef = firebase.storage().ref();
		storageRef.child(uniid + '/Documents/'+unifileid+'.pdf').getDownloadURL().then(function(url)     {
		    // `url` is the download URL for 'images/stars.jpg'

		   // This can be downloaded directly:
		   var xhr = new XMLHttpRequest();
		    xhr.responseType = 'blob';
		    xhr.onload = function(event) {
        var blob = xhr.response;
        
		    };
		    xhr.open('GET', url);
		    xhr.send();

        var iframe = document.createElement('iframe');
        // iframe.id = 'pdfIframe'
        iframe.className='pdfIframe'
        document.body.appendChild(iframe);
        iframe.style.display = 'none';
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
                URL.revokeObjectURL(url)
                // document.body.removeChild(iframe)
            }, 1);
        };
        iframe.src = url;
        modal[2].style.display = "none"
			
		     }).catch(function(error) {
          modal[2].style.display = "none"
		     // Handle any errors
    });
    modal[2].style.display = "none"
  });

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
          datarray.push({DateCreated: data.DateCreated, DateSent: data.DateSent, DateCreated:data.DateCreated , DateStatus: data.DateStatus, DocumentName: data.DocumentName, Owmer:data.Owner , OwnerEmail: data.OwnerEmail,  Recepients: recepients, Status: data.Status });
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
    
    //var url = 'https://pappayasign.surge.sh/#/admin/sign?id='+fileid+'&type=db&u='+resenduserid+''; 
    var ref = firebase.database().ref(resenduserid + '/Documents/'+fileid+'/Reciever/');  
			ref.once("value", function(snapshotchild) {
				snapshotchild.forEach(function(childdata){
          var data = childdata.val();
          var url = 'https://pappayasign.surge.sh/#/admin/sign?id='+fileid+'&type=db&u='+resenduserid+'&key='+data.key+''; 
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
              Body : `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign Activation.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, `+data.RecepientName+`</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="`+url+`" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`
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
                
                <CardBody className="bg-secondary" id="managebody">
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
             <CardBody id="detailbody"> 
                <Row>
                  <Col lg="12">
                  <Button color="primary" size="sm" type="button" className="px-4" id="detailbackbtn" > 
                Back
              </Button>
              <Button color="primary" size="sm" type="button" className="float-right" id="detaildownloadbtn" > 
                Download
              </Button>
              <Button color="primary" size="sm" type="button" className="float-right" id="detailprintbtn" > 
                Print
              </Button>
              </Col>
              <Col lg="12">
              <h4 className="py-4 px-3" color="dark">Details:</h4>
              </Col>
                  <Col lg="6" >
                <Col lg="12">
                
                <FormGroup>
                  <span className="emaillabelspan"><strong>Subject:</strong></span>
                  <span className="emaillabelspan" id="detailsubject"></span>
                  </FormGroup>
                  <FormGroup>
                  <span className="emaillabelspan"><strong>Envelope ID:</strong></span>
                  <span className="emaillabelspan" id="detailid"></span>
                  </FormGroup>
                  <FormGroup>
                  <span className="emaillabelspan"><strong>Date Sent:</strong></span>
                  <span className="emaillabelspan" id="detailsent"></span>
                  </FormGroup>
                  <FormGroup>
                  <span className="emaillabelspan"><strong>Date Created:</strong></span>
                  <span className="emaillabelspan" id="detailcreate"></span>
                  </FormGroup>
                  </Col>
                  </Col>
                  <Col lg="6" >
                  <Col lg="12">
                <FormGroup>
                  <span className="emaillabelspan"><strong>Holder:</strong></span>
                  <span className="emaillabelspan" id="detailholder"></span>
                  </FormGroup>
                  <FormGroup>
                  <span className="emaillabelspan"><strong>Envelope Recipients:</strong></span>
                  <span className="emaillabelspan" id="detailrecepients"></span>
                  </FormGroup>
                  <FormGroup>
                  <span className="emaillabelspan"><strong>Status:</strong></span>
                  <span className="emaillabelspan" id="detailstatus"></span>
                  </FormGroup>
                  <FormGroup>
                  <span className="emaillabelspan"><strong>Status Date:</strong></span>
                  <span className="emaillabelspan" id="detailstatusdate"></span>
                  </FormGroup>
                  </Col>
                    </Col>
                    <Col lg="12">
                    <h4 className="py-4 px-3" color="dark">Recepients:</h4>
                  <div className="managerecepientstable">
                  <ul id="managerecepientstable">
                  
                    </ul> 
                  </div>
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
