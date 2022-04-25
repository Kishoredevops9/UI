 
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BrowseMapService } from '../browse-map/browse-map-service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  maps : any =[];
  originalData;
  inputFieldValue = new FormControl();
  text = "";
  masterData: any = [];
  waittext : any = "Loading...";
  serchBoxTest : any;
  constructor(private lobbyHomeService: BrowseMapService) { }

  ngOnInit(): void {
    this.loadMaps();
  }

  loadMaps() {
    this.lobbyHomeService.getNav().subscribe(
      (data) => {
        let mpasData:any = data;
        let pushData : any = [];
        mpasData.forEach(function(item: any){
          let cloudStatus = item.isActive;
          if(cloudStatus){
            pushData.push(item);
          }
        }.bind(this))
        this.maps = pushData;        
        this.masterData = [...this.maps]
        //console.log(this.maps)
      }
    );
  }


  nodeSearch(searchText) {
    let data = [];
    let treeNodes = [...this.masterData];


    
    function innerSearch( n , topNode  ) {

 

      n.forEach(element => {
        if (   new RegExp(searchText.toLocaleLowerCase()).test(element.title.toLocaleLowerCase()) ){
          data.push(topNode)
        }
        
        if( element.children  ){
  
          innerSearch(element.children,topNode)
        }
      });
    

   

    }


     
          treeNodes.forEach((node) => {
            if (   new RegExp(searchText.toLocaleLowerCase()).test(node.title.toLocaleLowerCase()) ){
              data.push(node)
            }
            
            if( node.children  ){

                    innerSearch(node.children,node)
            }

          })


          let uniq = {}
          return    data.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));


     


  };


  dataExpend(data) {
    return data.map(({ type, children = [], ...rest }) => {
      const o = { ...rest    };  
        if (o.children && o.children.length) o.child = true;  
      if (children.length) o.children = this.dataExpend(children);
      return o;
    });
  }

    onKeyUp(event){
      this.waittext = "No Result found" ; 
      let SearchData = event.target.value.trim();
   
      if (SearchData){
        this.maps =    this.nodeSearch(SearchData)
        this.maps.map((node)=>{ 
         if (node.children && node.children.length) { 
         
          node.child = true;

          node.children.map((n1)=>{ 
            if (n1.children && n1.children.length) {             
             n1.child = true; 

             
          n1.children.map((n2)=>{ 
            if (n2.children && n2.children.length) {             
              n2.child = true; 
            }   
           })


            }   
           })
         
         }   
        })


        
      }
      else{
        this.maps = [...this.masterData]   ;
        this.maps.map((node)=>{ 
          if (node.children && node.children.length) node.child = false;   
         }) 
  
      }
    
  
    }

}

