 
export class FileUploadModel{
    fileName:string ='';
    fileType: string = '';
    UploadFile:any ;
    createdUser :string ='';
    relatedContentId:number;
    contentId:string='';
    constructor(){}

}

export class FileDetails{​​​​​
    fileName:string ='';
    fileUrl: string = ''; 
    fileType:string = ''; 
    relatedContentInformationId:number;
    
    constructor(){​​​​​}​​​​​
}​​​​​
/*"fileName": "RCTest.pdf",
"fileType": "pdf",                  
"UploadFile": "xvbsbhhsnmmsmmsjjj",
"version": 2,
"createdDateTime": "2021-02-05 14:07:22.187",
"createdUser": "TestUser"
*/