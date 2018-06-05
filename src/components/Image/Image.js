import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    onChange:   React.PropTypes.func,
  };

  constructor(props) {
    console.log("constructor")
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onRotate = this.onRotate.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.state = {
      size: 200,
      rotateDegree : 0,
      expand : false
    };
  }

  calcImageSize(newWidth) {
    const galleryWidth = newWidth || this.props.galleryWidth;
    const targetSize = 200;
    const imagesPerRow = Math.floor(galleryWidth / targetSize);
    var extra = (galleryWidth - imagesPerRow*targetSize)/imagesPerRow;
    const size = 200+extra;
    this.setState({
      size : size
    });
  }
  componentWillReceiveProps(nextProps){
    this.calcImageSize(nextProps.galleryWidth);
  }
  componentDidMount() {
    console.log("componentDidMount")
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  onDelete(){
    this.props.onChange(this.props.dto);
  }
  onRotate(){
    var newDegree = this.state.rotateDegree == 270 ? 0 : this.state.rotateDegree+90 
    this.setState({
      rotateDegree : newDegree
    })
  }
  onExpand(){

    this.setState({
      size : !this.state.expand ?  document.body.clientWidth/2 : 200,
      expand : !this.state.expand
    })
  }
  

  render() {
    let className = 'image-root';
    if(this.state.expand){
       return  (
          <div  className='modal-overlay'>
            <div className='modal-body'>

            <div
          className={className}
          style={{
            backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
            width: this.state.size + 'px',
            height: this.state.size + 'px',
            transform : 'rotate('+(this.state.rotateDegree)+'deg)'
          }}
          >
            <div
              style={{
                transform: 'rotate('+(this.state.rotateDegree*-1)+'deg)'
              }}
            >
            <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.onRotate} />
            <FontAwesome className="image-icon"  name="trash-alt" title="delete" onClick={this.onDelete}/>
            <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.onExpand}/>
          </div>
        </div>

          </div>
        </div>)
    }
    return (
        <div 
          className={className}
          style={{
            backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
            width: this.state.size + 'px',
            height: this.state.size + 'px',
            transform : 'rotate('+(this.state.rotateDegree)+'deg)'
          }}
          >
          <div
          style={{
            transform: 'rotate('+(this.state.rotateDegree*-1)+'deg)'
          }}
            >
            <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.onRotate} />
            <FontAwesome className="image-icon"  name="trash-alt" title="delete" onClick={this.onDelete}/>
            <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.onExpand}/>
          </div>
        </div>
    );
  }
}

export default Image;
