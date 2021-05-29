const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");
const test=document.getElementById("URL");
const ik=document.getElementById("Submit");

   
const accountName = "tinylogtable";
const sasString = "?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-06-25T20:34:09Z&st=2021-04-26T12:34:09Z&spr=https&sig=Uo60BucTjM1ppcvyz6cIvGWvmiQc1HQA%2FDc2cMlWmzg%3D";
const containerName = "itemsvdo-in";
const containerURL = new azblob.ContainerURL(
    `https://${accountName}.blob.core.windows.net/${containerName}?${sasString}`,
    azblob.StorageURL.newPipeline(new azblob.AnonymousCredential));

var account = "tinylogtable";
var sas = '?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-06-25T20:34:09Z&st=2021-04-26T12:34:09Z&spr=https&sig=Uo60BucTjM1ppcvyz6cIvGWvmiQc1HQA%2FDc2cMlWmzg%3D';
var table1 = 'videoinfo';
var table2 = 'redirectvideo';
var tableUri = '';

    
    const uploadFiles = async () => {
        try {
            //reportStatus("Uploading video");
            const promises = [];
            for (const file of fileInput.files) {
                const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, file.name);
                promises.push(azblob.uploadBrowserDataToBlockBlob(
                    azblob.Aborter.none, file, blockBlobURL));
                
            }
            await Promise.all(promises);
            //reportStatus("Done");
            listFiles();
        } catch (error) {
            //reportStatus("");
        }
    }   

    //selectButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", uploadFiles);
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
    function addEntity1() {
                var tableService = getTableService();
                if (!tableService)
                    return;

                if (table1 == null || table1.length < 1) {
                    alert('Invalid table name!')
                    return;
                }
                if (table2 == null || table2.length < 1) {
                    alert('Invalid table name!')
                    return;
                }

                var partitionKey1 = "VideoInfo";
                var partitionKey2 = "RedirectVideo";
                var fileName = document.getElementById('fn').value;
                var fileSize = document.getElementById('fs').value;
                
                var access_token = "cpp6z10cavht5PDMzzGkeJdtJaB2";
                


                //ADD TO VIDEOINFO

                    var rowKey = genRowKey();
                    
                    var name = document.getElementById('name');
                    var video_id = rowKey;
                    var insertEntity = {
                            PartitionKey: {'_': partitionKey1},
                            RowKey: {'_': rowKey},
                            FileStatus: {'_': "waiting"},
                            FileItemUri: {'_': "https://tinylogtable.blob.core.windows.net/itemsvdo-in/"+fileName},
                            Userid: {'_': access_token},
                            FileNameOri: {'_': fileName},
                            FileSize: {'_': fileSize},
                            VideoName: {'_': name.value},
                            Redirect_Count: {'_': addid}

                    };
                    
                    tableService.insertEntity(table1, insertEntity, function(error, result, response) {

                        if(error) {
                            alert('Insert Information Error');
                            console.log(error);
                        } else {
                            console.log('Insert Information successfully!');
                            
                            
                        }
                    
                    });



                //ADD TO REDIRECT URL
                for(i = 1;i <= addid;i++)
                {
                    var rowKey = genRowKey();
                    var url = document.getElementById('url'+i);
                    var time = document.getElementById('time'+i);
                    var img = document.getElementById('img'+i);
                    var insertEntity2 = {
                            PartitionKey: {'_': partitionKey2},
                            RowKey: {'_': rowKey+"_0"},
                            Video_ID: {'_': video_id},
                            RedirectTime: {'_': time.value},
                            RedirectUrl: {'_': url.value},
                            Image_URi: {'_': img.src},
                            RedirectNo: {'_': "0"}
                                
                    };
                    tableService.insertEntity(table2, insertEntity2, function(error, result, response) {
                        if(error) {
                            alert('Insert Information Error');
                            console.log(error);
                        } else {
                            console.log('Insert Information successfully!');
                        }
                    });
                }
                alert('Insert Information successfully! Please wait a moment...');
                setTimeout(function(){
                    window.location.href = 'listfile.html';
                 }, 3000);
    }



    //EDIT WHOLE VIDEO
    function editEntity() {
        //Old redirect number
        count;
        //New redirect number
        addid;

        var tableService = getTableService();
        if (!tableService)
            return;
        if (table2 == null || table2.length < 1) {
            alert('Invalid table name!')
            return;
        }
        var partitionKey1 = "VideoInfo";
        var partitionKey2 = "RedirectVideo";
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var rowKey = urlParams.get('vid');
        var video_id = urlParams.get('vid');
        var name = document.getElementById('name');

        //UPDATE VIDEO INFO
        var updatedTask = {
            PartitionKey: {'_': partitionKey1},
            RowKey: {'_': rowKey},
            VideoName: {'_': name.value},
            Redirect_Count: {'_': addid}
                
        };
        tableService.mergeEntity(table1, updatedTask, function(error, result, response){
            if(error) {
                console.log(error);
            } else {
                console.log(result);
                console.log(response);
                
            }
        });
        //DELETE LINK
        for(i = 1;i <= count;i++)
        {
            var deleteTask2 = {
                PartitionKey: {'_': partitionKey2},
                RowKey: {'_': row_key[i-1]}
                        
            };
            tableService.deleteEntity(table2, deleteTask2, function(error, result, response){
                if(error) {
                    alert('Del Information Error');
                    console.log(error);
                } else {
                    console.log('Del Information successfully!');
                    console.log(result);
                    console.log(response);
                    
                }
            });
        }
        //ADD NEW LINK(S)
        for(i = 1;i <= addid;i++)
        {
            var rowKey = genRowKey();
            var url = document.getElementById('url'+i);
            var time = document.getElementById('time'+i);
            var img = document.getElementById('img'+i);
            var insertEntity2 = {
                    PartitionKey: {'_': partitionKey2},
                    RowKey: {'_': rowKey+"_0"},
                    Video_ID: {'_': video_id},
                    RedirectTime: {'_': time.value},
                    RedirectUrl: {'_': url.value},
                    Image_URi: {'_': img.src},
                    RedirectNo: {'_': "0"}
                        
            };
            tableService.insertEntity(table2, insertEntity2, function(error, result, response) {
                if(error) {
                    alert('Insert Information Error');
                    console.log(error);
                } else {
                    console.log('Insert Information successfully!');
                }
            });
        }
        
            
        alert('Insert Information successfully! Please wait a moment...');
        setTimeout(function(){
            window.location.href = 'listfile.html';
        }, 3000);
    }
