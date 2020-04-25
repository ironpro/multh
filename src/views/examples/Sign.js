import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
import PDFAnnotate from '../../components/PDFAnnotate/pdfannotate'
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";

class Icons extends React.Component {
  state = {};
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--9 pb-3 mx-6">
        <Card className="shadow border-0 pb-2 mb-3 bg-dark">
              <CardBody>
                <Row>
              <Col lg="12" className="form-check form-check-inline">
              <div className="stepwizard">
              <div className="stepwizard-row">
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">1</button>
                      <p className="steplabel">Add</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">2</button>
                      <p className="steplabel">Select</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">3</button>
                      <p className="steplabel">Process</p>
                  </div> 
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary-outline btn-circle-process">4</button>
                      <p className="steplabel">Review</p>
                  </div> 
              </div>
          </div>
              </Col>
              </Row>
              </CardBody>
              </Card>
        
        <Card className=" shadow ">
        

                <CardBody>
                 <PDFAnnotate/>
                </CardBody>
              </Card>
              </Container>
      </>
    );
  }
}

export default Icons;
