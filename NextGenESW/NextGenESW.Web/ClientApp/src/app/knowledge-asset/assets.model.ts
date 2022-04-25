export interface knowledgeAsset {
    id: number;
    title: string;
    description: string,
    assetUrl: string;
    createdDateTime:Date;
    createdUser: string;
    lastUpdateDateTime: Date;
    assetStatusId?: number;
    lastUpdateUser: string;
    index: number;
    isHidden:true;
    isActive:true;
    thumbnailUrl:string;
    thumbnailImgString:string;
    isFeatured:boolean;
    version:0;
    effectiveFrom:Date;
    effectiveTo:Date;
    
  
  }