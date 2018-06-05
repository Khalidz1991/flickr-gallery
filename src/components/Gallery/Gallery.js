import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import config from 'config';
import keys  from '../../config/keys.js';

console.log(keys);
var FlickerTimer = null;
var resizeTimer = null;
var page = 1;
var isLoading = false;

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.onResize = this.onResize.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
    };
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = (w,h,q,e) => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2000) && this.state.images.length
    ) {
      if(!isLoading){
        page++;
        console.log(page);
        isLoading = true;
        this.getImages(this.props.tag)
      }
    }
  }
  onResize = (w,h,q,e) => {
    var gallary = this;
    console.log("onResize")
    if(resizeTimer)
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        gallary.setState({
          galleryWidth : gallary.getGalleryWidth(),
        })
    },1000)
    
  }
 

  getGalleryWidth(){
    try {
      console.log(document.body.clientWidth)
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    console.log(process,process.env,process.env.REACT_APP_FLICKER_API_KEY);
    if(FlickerTimer)
      clearTimeout(FlickerTimer);
      var gallary = this;
      FlickerTimer = setTimeout(function() {
      localStorage.setItem('tag',tag)
      fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+keys.apiKey+'&tags='+tag+'&page='+page+'&format=json&nojsoncallback=1')
      .then(function(response){
        return response.json();
      }).then(function(j){
        console.log(j);
        let picArray = j.photos.photo.map((pic) => {
          
          var srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
          return pic;
        })
        gallary.setState({images: this.state.images.concat(picArray)});
        isLoading = false;
      }.bind(gallary))
    },2000)
    
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
    window.addEventListener('resize', this.onResize, false);
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth,
      images : this.state.images
    });
  }

  componentWillReceiveProps(props) {
    this.state.images = [];
    this.getImages(props.tag);
  }
  deleteHandler(dto){
    this.state.images.splice(this.state.images.indexOf(dto),1);
    this.setState({
      images  : this.state.images,
    })
  }
  render() {
   return (
     <div className="gallery-root">
       {this.state.images.map((dto,index) => {
         return <Image  index={index} key={'image-' + dto.id} dto={dto} onChange={this.deleteHandler} galleryWidth={this.state.galleryWidth}/>;
       })}
     </div>
   );
  }
}

export default Gallery;
