import React from 'react'
import axios from 'axios'
import jsPDF from "jspdf"
import { useState } from 'react'
import { useEffect } from 'react'
import { CSVLink } from "react-csv"; //<--for excel
import { saveAs } from 'file-saver'; //<--for word

const Filedown = () => {
    const [result, setresult] = useState([]);

    const getdata=async()=>{
        let res=await axios.get("https://jsonplaceholder.typicode.com/posts")
        setresult((res.data).slice(0,5))
    }
    useEffect(() => {
        getdata() 
    }, []);

    const pdfGenerate=()=>{
        var doc=new jsPDF("landscape","px","a4",false)        
        let x1=30
        let x2=70
        let y1=80
        let y2=100
        let count=0       
     
        result && result.map((e)=>{
            doc.text("Title : ",x1,y1,) 
            doc.text("Body : ",x1,y2,)
            doc.text(e.title ,x2,y1,)
            doc.text((e.body),x2,y2,)
            count=count+1
            if(count%3===0){
                doc.addPage()
                y1=80
                y2=100
            }else{
                y1=y1+80
                y2=y2+80  
            }                   
        })
        doc.save("Synclog.pdf")
      } 


      function downloadWordFile() {
        const blob = new Blob(result.map((e)=>{
          return ["Title is : "+e.title+"\n\n"+ "Body is : "+e.body +"\n\n"]
        }));
        saveAs(blob, 'document.doc');
      }


      const downloadTxtFile = () => {
        const texts =result && result.map((e)=>{
           return ["Title : "+e.title+"\n\n"+"Body : "+e.body +"\n\n"]

        })
        const file = new Blob(texts, {type: 'text/plain'});
    
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
    
        element.download = "Syncdata" + ".txt";
        document.body.appendChild(element); 
        element.click();
    }
   
  return (
    <div>
      <h1>Click here to download</h1>
      <button onClick={pdfGenerate}>Download PDF</button>
      
      <button><CSVLink data={result && result} filename={"fakeData.csv"}>Download Excel</CSVLink></button>

      <button onClick={downloadWordFile}>Download Word File</button>
      <button onClick={downloadTxtFile}>Download Text File</button>

    </div>
  )
}
export default Filedown
