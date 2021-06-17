//Firebase Variable
const auth = firebase.auth();
var displayName;
var email;
var uid;

//Azure Function Variables
var userRole;
var azureuid;
document.getElementById('signOutBtn').onclick = () => auth.signOut();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // signed in
        displayName = user.displayName;
		console.log("Name: " + displayName);
        email = user.email;
        uid = user.uid;
        
		checkRole();
		} else {
        // return to login page 
        window.location.replace("index.html");
  
    }
});
/// Azure Storage Table Operation ///

// Config information
var account = "tinylogtable";
var sas = '?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-06-25T20:34:09Z&st=2021-04-26T12:34:09Z&spr=https&sig=Uo60BucTjM1ppcvyz6cIvGWvmiQc1HQA%2FDc2cMlWmzg%3D';
var usertable = 'userinfo';
var tableUri = '';

function checkParameters() {

    if (account == null || account.length < 1)
    {
        alert('Please enter a valid storage account name!');
        return false;
    }
    if (sas == null || sas.length < 1)
    {
        alert('Please enter a valid SAS Token!');
        return false;
    }
    return true;
}

function getTableService() {
    
    if (!checkParameters())
        return null;

    tableUri = 'https://' + account + '.table.core.windows.net';
    var tableService = AzureStorage.Table.createTableServiceWithSas(tableUri, sas).withFilter(new AzureStorage.Table.ExponentialRetryPolicyFilter());
    return tableService;
}
var Company = '';
function checkRole() {
    var tableService = getTableService();
    if (!tableService)
        return;

    if (usertable == null || usertable.length < 1) {
        alert('Please select a table from table list!')
        return;
    }

    var usertableQuery = new AzureStorage.Table.TableQuery().where('Email eq ?', email);
    tableService.queryEntities(usertable, usertableQuery, null , function(error, results) {
        if (error) {
            alert('List table entities error, please open browser console to view detailed error');
            console.log(error);
        } 
        else {
            var output = [];
            output.push('<tr>',
                            
                            '<th>The email</th>',
                            '<th>The roleid</th>',
                            '<th>The userid</th>',
                            
                        '</tr>');
            if (results.entries.length < 1) {
                output.push('<tr><td>Empty results...</td></tr>');
				addNewUser();
            }
            for (var i = 0, entity; entity = results.entries[i]; i++) {
                var Email = '';
                var Roleid = '';
                var Userid = '';
				
                
                if (typeof entity.Email !== 'undefined') {
                    Email = entity.Email._;  
                }

                if (typeof entity.Roleid!== 'undefined') {
                    Roleid = entity.Roleid._;
                    
                    if (Roleid == "ROLE00") {
                        //Admin UI
                        userRole = "Admin";
						document.getElementById("navUser").style.display = "block";
		                document.getElementById("navEmbed").style.display = "block";
		                document.getElementById("navVideo").style.display = "block";
                    }
                    else if (Roleid == "ROLE01") {
                        //Free User Interface
                        userRole = "Free User";
                    }
                    else if (Roleid == "ROLE02") {
                        //Paid User Interface
                        userRole = "Paid User";
                        document.getElementById("navEmbed").style.display = "block";
		                document.getElementById("navVideo").style.display = "block";
                    }
					else {
						userRole = "Super Admin";
                        document.getElementById("navComp").style.display = "block";
						document.getElementById("navUser").style.display = "block";
		                document.getElementById("navEmbed").style.display = "block";
		                document.getElementById("navVideo").style.display = "block";
					}
                    console.log("User Role: " + userRole);
                }
				
				if (typeof entity.Company!== 'undefined') {
                    Company = entity.Company._;
					console.log("Company Name: " + Company);
				}
				
                if (typeof entity.Userid !== 'undefined') {
                    Userid = entity.Userid._;
                    azureuid = Userid;
					console.log("User id: " + azureuid);
                }
               
            }

        }
    });
}

function addNewUser(x) {
	var tableService = getTableService();
    if (!tableService)
        return;

    if (usertable == null || usertable.length < 1) {
        alert('Invalid table name!')
        return;
    }
    var insertEntity = {
                PartitionKey: {'_': 'UserInfo'},
                RowKey: {'_': uid},
                Company: {'_': "none"},
                DisplayName: {'_': displayName},
                Email: {'_': email},
                Roleid: {'_': 'ROLE01'},
                Userid: {'_': uid}

        };
        
        tableService.insertEntity(usertable, insertEntity, function(error, result, response) {

            if(error) {
                alert('Insert Information Error');
                console.log(error);
            } 
        });
}
//Check Company Code
function enterCompCode()
{
    var companyinfo = "companyinfo";
    var tableService = getTableService();
    if (!tableService)
        return;

    if (companyinfo == null || companyinfo.length < 1) {
        alert('Please select a table from table list!')
        return;
    }
    var code = document.getElementById('compcode').value;
    var companyinfoQuery = new AzureStorage.Table.TableQuery().where('Code eq ?', code);
    tableService.queryEntities(companyinfo, companyinfoQuery, null , function(error, results) {
        if (error) {
            alert('List table entities error, please open browser console to view detailed error');
            console.log(error);
        } 
        else {
            if (results.entries.length < 1) {
                alert("Code Incorrect");
            }
            else
            {
                entity = results.entries[0];
                var new_Company = entity.RowKey._;
                var updatedTask = {
                    PartitionKey: {'_': 'UserInfo'},
                    RowKey: {'_': azureuid},
                    Company: {'_': new_Company}
                        
                };
                tableService.mergeEntity(usertable, updatedTask, function(error, result, response){
                    if(error) {
                        console.log(error);
                    } else {
                        console.log(result);
                        console.log(response);
                        
                    }
                });
                alert("Entering "+new_Company);

            }
        }

    });
}
function get_company_code()
{
    
    var companyinfo = "companyinfo";
    var tableService = getTableService();
    if (!tableService)
        return;

    if (companyinfo == null || companyinfo.length < 1) {
        alert('Please select a table from table list!')
        return;
    }
    var companyinfoQuery = new AzureStorage.Table.TableQuery().where('Rowkey eq ?', Company);
    tableService.queryEntities(companyinfo, companyinfoQuery, null , function(error, results) {
        if (error) {
            alert('List table entities error, please open browser console to view detailed error');
            console.log(error);
        } 
        else {
            if (results.entries.length < 1) {
            }
            else
            {
                entity = results.entries[0];
                document.getElementById("showcompanycode").innerHTML = entity.Code._;

            }
        }

    });
    
}
function show_vid(){
        
    //GET VIDEO DATA
    var tableQuery = new AzureStorage.Table.TableQuery().where('RowKey eq ?', rowkey);
    //GET REDIRECT URL DATA
    var tableQuery2 = new AzureStorage.Table.TableQuery().where('Video_ID eq ?', rowkey);
    //CHECK IF USER IN SAME COMPANY
    tableService.queryEntities(table, tableQuery, null, function(error, results) {
        var userid = results.entries[0].Userid._;
        var tableQuery1 = new AzureStorage.Table.TableQuery().where('Userid eq ?', userid);
        //SHOW THE OWNER OF VIDEO
        tableService.queryEntities(table3, tableQuery1, null, function(error, results2) {
            var user_comp = results2.entries[0].Company._;
            //IF USER IN SAME COMPANY
            if(Company == user_comp)
            {
                tableService.queryEntities(table, tableQuery, null, function(error, results) {
                    videoSource.setAttribute('src', results.entries[0].FileItemUri._);
                    video.appendChild(videoSource);
                    video.load();
                    //video.play();
                    document.getElementById("name").value = results.entries[0].VideoName._;
                    //https://tinylogtable.blob.core.windows.net/itemsvdo-in/2021060715235058.mp4
                    var fn2 = results.entries[0].FileItemUri._
                    fn2 = fn2.substr(55);
                    document.getElementById("fn").value = fn2;
                    document.getElementById("fs").value = results.entries[0].FileSize._;
                    count = results.entries[0].Redirect_Count._;
                    addid = count;
                });
                tableService.queryEntities(table2, tableQuery2, null, function(error, results) {
                    
                    var addList = document.getElementById('addlink');
                    
                    for(i = 1;i <= count;i++)
                    {
                        row_key.push(results.entries[i-1].RowKey._);
                        var text = document.createElement('div');
                        text.id = 'additem_' + i;
                        text.innerHTML = `<label>
                                            <b id="show_url`+i+`" style="padding-left: 15px"> URL `+i+` </b> 
                                        </label> 
                                        <input type="url"  id="url`+i+`"  placeholder="Your URL" required>
                                        <label>
                                            <b id="redirect`+i+`" style="padding-left: 15px"> Redirect time `+i+` </b> 
                                        </label> 
                                        <input type="text" id="time`+i+`" placeholder="HH:MM:SS " />
                                        <label>
                                            <b id="thumbnail`+i+`" style="padding-left: 15px"> Thumbnail `+i+` </b> 
                                        </label> 
                                        <img id="img`+i+`" style='height:120px;width:160px;padding-left: 15px' ">
                                        <button type="button" id="remove`+i+`" data-id="`+i+`" class="btn btn-danger remove" style="margin-left: 15px">X</button>
                        `;

                        addList.appendChild(text);
                        document.getElementById("img"+i).src = results.entries[i-1].Image_URi._;
                        document.getElementById("url"+i).value = results.entries[i-1].RedirectUrl._;
                        document.getElementById("time"+i).value = results.entries[i-1].RedirectTime._;




                        //ADD TO MODAL
                        var validatelink = document.getElementById('validatelink');
                        var docstyle = validatelink.style.display;
                        if (docstyle == 'none') validatelink.style.display = '';
                        var text = document.createElement('div');
                        text.id = 'additem_' + i;
                        text.innerHTML = `<label>
                                            <b id="show_url`+i+`" style="padding-left: 15px"> URL `+i+` </b> 
                                        </label> 
                                        <input disabled type="url"  id="va_url`+i+`"  placeholder="Your URL" required>
                                        <label>
                                            <b id="redirect`+i+`" style="padding-left: 15px"> Redirect time `+i+` </b> 
                                        </label> 
                                        <input disabled type="text" id="rtime`+i+`" placeholder="HH:MM:SS " />
                                        
                                        <label>
                                            <b id="thumbnail`+i+`" style="padding-left: 15px"> Thumbnail `+i+` </b> 
                                        </label> 
                                        <img id="rimg`+i+`" style='height:120px;width:160px;padding-left: 15px' ">
                        `;
                        
                        validatelink.appendChild(text);
                        document.getElementById("rimg"+i).src = results.entries[i-1].Image_URi._;
                        document.getElementById("va_url"+i).value = results.entries[i-1].RedirectUrl._;
                        document.getElementById("rtime"+i).value = results.entries[i-1].RedirectTime._;
                        
                    }
                    
                
                    var thisrowkey = results.entries[0].RowKey._;
                });

                }
                else
                {
                    alert('You don\'t have permission to edit this video!');
                    window.location.replace("listfile.html");

                }
            });


        });
    }