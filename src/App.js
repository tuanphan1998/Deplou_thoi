import React, { Component } from 'react';
import './App.css';
import Tesseract from "tesseract.js";
import translate from 'translate';  
import LoadingScreen from 'react-loading-screen';
translate.engine = 'google';
translate.key = 'AIzaSyDOzkQB5bI79zKBSiHGH8JRjlI6sM-cBwc';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      patterns: [],
      documents: [],
      changso : 0,
      cam : "eng"
    };
  }
  handleChange = (event) => {
    if (event.target.files[0]) {
      var uploads = []
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key]
        uploads.push(URL.createObjectURL(upload))
      }
      this.setState({
        uploads: uploads
      })
    } else {
      this.setState({
        uploads: []
      })
    }
  }
   generateText =  () => {
      try
      {
        let uploads = this.state.uploads
  
        for(var i = 0; i < uploads.length; i++) {
          Tesseract.recognize(uploads[i], {
            lang: this.state.cam
          })
          .catch(err => {
            console.error(err)
          })
          .then(result => {
            // Get Confidence score
            let confidence = result.confidence
      
            // Get full output
            let text = result.text
            translate(result.text, {  to: 'vi' }).then(text2 => {
              console.log(text);  
                // Get codes
            let pattern = /\b\w{10,10}\b/g
            let patterns = result.text.match(pattern);
      
            // Update state
            this.setState({ 
              patterns: this.state.patterns.concat(patterns),
              documents: this.state.documents.concat({
                pattern: patterns,
                text: text,
                text2 : text2,
                confidence: confidence
              })
            })
            });
            
          
          })
        }
        this.setState({changso : 1});
      }
      catch(error)
      {
        console.log(error);
      }
  }


  ngoaiLe = () => {
    try {
      this.generateText();
    } catch (error) {
      // ...'
      console.log(error);
    }
  }


  changeState2 = (event) => {
    const value = event.target.value;
    this.setState({
      cam : value
    });
     
  }

  buttonEnable = () => {
    if(this.state.uploads[0])
    {
      return(
        <button type="button" className="btn btn-primary" onClick={()=>this.ngoaiLe()} disabled={false}>😅 Phân tích</button>
      )
    }
    else
    {
      return(
        <button type="button" className="btn btn-primary" onClick={()=>this.ngoaiLe()} disabled={true}> 🤗Phân tích</button>
      )
    }
  }

  titleTool = () => {
    if(this.state.uploads[0])
    {
      return(
        <></>
      )
    }
    else
    {
      return(
        <h5> "Công cụ chuyển đổi hình ảnh thành văn bản . Kèm theo tính năng dịch phát triển bởi Phan Kim Tuân"</h5>
      )
    }
  }

  ListenerLangNghe = () => {
    if(this.state.changso === 0)
    {
      return(<></>)
    }
    else if(this.state.changso === 1)
    {
      let temp = this.state.documents.length;
      let goc = true;
      if(temp > 0)
      {
        goc = false;
      }
      console.log(goc);
      return(
        <>
        <LoadingScreen loading={goc}  spinnerColor='#9ee5f8' logoSrc="https://i.pinimg.com/originals/c5/98/77/c5987751bddee68c4ddb8d069b515e65.gif" textColor='#676767'  text='Chờ tí nha'>
        {
                 this.state.documents.map((value, index) => {
                  
                  try
                  {
                    return (

                      <div  key={index} className="alert alert-success" role="alert">
                        <div className="results__result">
                        <div className="results__result__image">
                          <img src={this.state.uploads[index]} width="250px" alt={value.pattern.map((pattern) => { return pattern + ', ' })} />
                        </div>
                        <div className="results__result__info">
                          <div className="results__result__info__codes">
                          <small><strong>Tỉ lệ chính xác đạt:</strong> {value.confidence}{"%"}</small>
                          </div>
                          <div className="results__result__info__codes">
                            <small><strong>Dạng tài liệu đầu ra:</strong> {value.pattern.map((pattern) => { return pattern + ', ' })}</small>
                          </div>
                          <div className="results__result__info__text">
                            <small><strong>Văn bản đầu ra:</strong> {value.text}</small>
                          </div>
                          <div className="results__result__info__text">
                            <small><strong>Văn bản được dịch:</strong>{value.text2}</small>
                          </div>
                        
                        </div>
                      </div>
                      <small><strong>HÌNH ẢNH SAU SẼ KHÔNG LOAD LẠI</strong></small>
                      </div>
                    )
                  }
                  catch(error)
                  {
                    console.log("da gay ra loi");
                  }
                }) 
          }
        </LoadingScreen>
        </>
      )
    }
  }

  render() {
    return (




      <div className="container">
      <div className="row mbr-justify-content-center mt-5">
        {this.titleTool()}
        <div className="col-lg-6 mbr-col-md-6">

        { /* File uploader */ }
        <section>
          <label className="fileUploaderContainer">
            Drop hình ảnh vào viền này
            <input type="file" id="fileUploader" onChange={this.handleChange} multiple />
          </label>

          <div>
            { this.state.uploads.map((value, index) => {
              return <img key={index} src={value} width="400px" alt="demo1" />
            }) }
          </div>
          <div className="btn-group btn-group-toggle">
            {this.buttonEnable()}
          <button type="button" className="btn btn-success" data-toggle="modal" data-target="#exampleModal"> 😁 Lựa chọn ngôn ngữ trong hình ảnh  DEFAULT : ENG</button>
           {/* Ngôn ngữ */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Các bạn chọn ngôn ngữ của hình ảnh</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                  <select className="form-control" id="exampleFormControlSelect1" onChange={(event)=>this.changeState2(event)} name="cam">
                      <option value={"deu"}>Tiếng Đức</option>
                      <option value={"deu-f"}>Tiếng Đước - Fraktur</option>
                      <option value={"eng"}>Tiếng Anh</option>
                      <option value={"eus"}>Tiếng Basque</option>
                      <option value={"fra"}>Tiếng pháp</option>
                      <option value={"ita"}>Tiếng ý</option>
                      <option value={"nld"}>Tiếng Hà Lan - Flemish</option>
                      <option value={"por"}>Tiếng Bồ Đào Nha</option>
                      <option value={"spa"}>Tiếng Tây Ban Nha</option>
                      <option value={"vie"}>Tiếng Việt</option>
                    </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Lưu lại</button>
              </div>
            </div>
          </div>
        </div>
            
          </div>
        </section>
        


            
        </div>
        <div className="col-lg-6 mbr-col-md-6">


        { /* Results */ }


       



<section className="results">
      {/* {Load Time} */}
      {this.ListenerLangNghe()}
</section>
       </div>
    </div>
      </div>
    )
  }

}

export default App;