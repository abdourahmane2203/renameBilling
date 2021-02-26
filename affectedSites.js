const express = require('express');

const neatcsv = require('neat-csv');
const fs = require('fs');
var mysql      = require('mysql');

const app = express();


var connection = mysql.createConnection({
  host     : '192.168.180.180',
  user     : 'root',
  password : 'Expresso2015',
  database : 'sitesmgt'
});

connection.connect();

app.listen(3005,()=>{
    fs.readFile('./sites_management_expresso.csv', async (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const responseCsv = await neatcsv(data)
        responseCsv.forEach((row)=>{
            if (row.affectedSite != undefined && row.affectedSite != '') {
                let affectedSites = row.affectedSite.split(',');
                console.log('site: ', row.sitename, '=>',row.affectedSite);
                //debugger; throw 1;
                affectedSites.forEach((element)=>{
                    connection.query('SELECT * FROM sites', function (error, results, fields) {
                        if (error) throw error;
                        let sitesAffectes = '';
                        results.forEach((sites)=>{
                            if (sites.sitename == row.sitename) {
                                siteId = sites.id;
                            }
                            if (sites.sitename == element) {
                                sitesAffectes = sites.id;
                            }
                        });
                        //debugger; throw 1;
                        // INSERT IN THE TABLE
                        const sql = `INSERT INTO sitesmgt.affected_sites (site_id,site_affected_id) VALUES (?,?);
                                    `
                        if (sitesAffectes != '') {
                            console.log('affectedId: ', sitesAffectes);
                            console.log('siteId:', siteId);
                            connection.query(sql,[siteId,sitesAffectes],
                                function(error, results, fields){
                                    if (error) throw error;
                                    console.log(results);
                            });
                        } 
                      });
                      
                })
                //debugger; throw 1;
            }
            
        })  

      });

    console.log('Server running successfully on 3005')
});