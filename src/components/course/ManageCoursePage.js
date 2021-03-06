import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseAction';
import CourseForm from './CourseForm';
import toastr from 'toastr';

export class ManageCoursePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      course: Object.assign({}, props.course),
      errors: {}
    };
this.updateCourseState=this.updateCourseState.bind(this);
this.saveCourse=this.saveCourse.bind(this);
  }

componentWillReceiveProps(nextProps) {
  if(this.props.course.id != nextProps.course.id){
  this.setState({
    course:Object.assign({}, nextProps.course)
  });
  }
}

updateCourseState(event){

  const field=event.target.name;
  //console.log('dd@'+field);
  let course=this.state.course;
  course[field]=event.target.value;
//console.log('@@@'+course.field);
  return this.setState({
    course:course
  });
}
saveCourse(event){
  event.preventDefault();
  this.props.actions.saveCourse(this.state.course).then(()=>this.redirect());

}
redirect(){
  this.context.router.push('/courses')
}
  render() {
    return (
      <CourseForm
        onChange={this.updateCourseState}
        allAuthors={this.props.authors}
        onSave={this.saveCourse}
        course={this.state.course}
        errors={this.state.errors}
      />
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired

};

//Pull in the React Router context so router is available on this.context.router.
ManageCoursePage.contextTypes = {
  router: PropTypes.object

};

function getCourseyID(courses,id) {
  const course=courses.filter(course=> course.id==id);
  if(course) return course[0];
  return null;
}

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id; // from the path `/course/:id`


  let course = {id: '', watchHref: '', title: '', authorId: '', length: '', category: ''};
  if(courseId && state.courses.length>0){
     course=getCourseyID(state.courses,courseId);
  }
  const authorsFormattedDropdown=state.authors.map(author=>{
    return{
      value:author.id,
      text:author.firstName+ ' '+ author.lastName
    };
  });
  return {
    course: course,
    authors: authorsFormattedDropdown
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
