import React, { Component } from "react";
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import { LocalForm, Control, Errors } from "react-redux-form";
import { Link } from "react-router-dom";
import {Loading} from  "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <Card>
        <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
        <CardBody>
          <CardText>{campsite.description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
}

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values){
    this.toggleModal()
    this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text)
  }

  render() {
    return (
      <>
        <Button outline onClick={this.toggleModal}>
          {" "}
          <i className="fa fa-pencil fa-lg" /> Submit Comment
        </Button>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={values => this.handleSubmit(values)}>
              <div className="form-group">
                <Label htmlFor="rating">Rating</Label>
                <Control.select id="rating" name="rating" model=".rating" className="form-control">
                  <option value="blank"></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Control.select>
              </div>

              <div className="form-group">
                <Label htmlFor="author">Your Name</Label>
                <Control.text id="author" name="author" model=".author" className="form-control"
                  validators={{ 
                      required, 
                      minLength: minLength(2), 
                      maxLength: maxLength(15)
                    }}
                 />
                 <Errors className="text-danger" model=".author" show="touched" component="div" 
                      messages={{
                        required: 'Required',
                        minLength: 'Must be at least 2 characters',
                        maxLength: 'Must be 15 characters or less'
                      }}
                    />
              </div>

              <div className="form-group">
                <Label htmlFor="text">Comment</Label>
                <Control.textarea id="text" name="text" rows="6" model=".text" className="form-control" />
              </div>

              <Button type="submit" color="primary">
                Submit
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

function RenderComments({ comments, postComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        {comments.map((comment) => (
          <p>
            {comment.text} <br />
            --{comment.author} {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(Date.parse(comment.date)))}
          </p>
        ))}
        <CommentForm campsiteId={campsiteId} postComment={postComment} />
      </div>
    );
  }

  return <div></div>;
}

function CampsiteInfo(props) {
  if (props.isLoading){
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    )
  }

  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    )
  }

  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>

        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments comments={props.comments} postComment={props.postComment} campsiteId={props.campsite.id}/>
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default CampsiteInfo;
