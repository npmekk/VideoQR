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