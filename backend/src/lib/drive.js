function upload(params) {
    // get folder 
    let folder = DriveApp.getFolderById(params.folder_id);
    
    // process file
    let data = params.file.dataURL;
    let contentType = data.substring(5, data.indexOf(';'));
    let bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7));      
    let blob = Utilities.newBlob(bytes, contentType, params.file.filename);

    let file = folder.createFile(blob);

    // set to public
    if(params.public) file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);    

    return {
        id: file.getId(),
        name: file.getName()        
    }
}