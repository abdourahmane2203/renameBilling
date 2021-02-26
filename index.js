const express = require('express');

const neatcsv = require('neat-csv');
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');


const app = express();

var _getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;

};

app.listen(3005,()=>{
    
    let contentDir =  _getAllFilesFromFolder('./SINGLE');
 
    //console.log(path.basename(contentDir[0])); //debugger; throw 1;
    fs.readFile('./db/single.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const responseCsv = await neatcsv(data)
        responseCsv.forEach((row)=>{
            //console.log(row);
            let error = Array()
            
                for (let count = 0; count < contentDir.length; count++) {
                    var i = 0;
                    let fileName = path.basename(contentDir[count]);
                    const acctCode = fileName.split('_')[1]; 
                    //console.log(acctCode);
                    if (row.ACCT_CODE.trim() == acctCode.trim()) {
                    //console.log(row.COMPANY_NAME.trim());
                    const oldFileNmae = path.basename(contentDir[count]).split('.');
                    //let newFileName = oldFileNmae[0]+'.'+oldFileNmae[1]+'_'+row.COMPANY_NAME.trim()+'.pdf';
                    let newFileName = row.COMPANY_NAME.trim()+'.pdf';
                    console.log(newFileName)
                    //console.log(contentDir[count]+'_'+row.COMPANY_NAME.trim());
                    
                   fs.rename(contentDir[count], __dirname +'/SINGLE/'+newFileName , (err, result) =>{
                        
                        error.push('error', i+1+':'+err);
                        //console.log(err);
                    });
                    
                } 
                }
                
            
            //console.log('ACCT_CODE',row.ACCT_CODE.trim()); 
            //console.log('errors',error);    
        });

      });
    
    console.log('Server running successfully on 3005');
});