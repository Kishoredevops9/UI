import { TaskActionTypes, TaskAction } from './task.actions';


const initialState: any =
{
  "property" : [],
  "knowledgereview" : [],
  "buildtask" : [],
}

const initialStateBuildTask: any = []
 


export function TaskReducer(state: any = initialState, action: TaskAction) {
  switch (action.type) {
    case TaskActionTypes.ADD_ITEM:
    {

      if (action.payload.type == 'CHP') {



       var actionData = state.property.filter((node)=>{
             return node.id >8

       })

       var finalData = actionData.concat(  action.payload.data  )

        return   Object.assign({}, state, {
          property: Object.assign([],   finalData  ),
          knowledgereview: Object.assign([],  finalData ),
          buildtask: Object.assign([],   finalData  )
        })



      }



      if (action.payload.type == 'property') {
       var actionData = state.property.filter((node)=>{
        return node.id < 8

  })

  var finalData = actionData.concat(  action.payload.data  )

   return   Object.assign({}, state, {
     property: Object.assign([],   finalData  ),
     knowledgereview: Object.assign([],  finalData ),
     buildtask: Object.assign([],   finalData  )
   })


      // return   Object.assign({}, state, {
      //   property: Object.assign([],   action.payload.data  ),
      //   knowledgereview: Object.assign([],   action.payload.data  ),
      //   buildtask: Object.assign([],   action.payload.data  )
      // })
    }



    if (action.payload.type == 'knowledgereview') {
      return   Object.assign({}, state, {
        knowledgereview: Object.assign([],   action.payload.data  )
      })

    }

    if (action.payload.type == 'buildtask') {
      return   Object.assign({}, state, {
        buildtask: Object.assign([],   action.payload.data  )
      })

    }



    }
    case TaskActionTypes.DELETE_ITEM:
      {
         if (action.payload.type == 'property') {
          let data =    state.property.filter(item => item.id !== action.payload.data.id);
          return   Object.assign({}, state, {
            property: Object.assign([],  data ),
            knowledgereview: Object.assign([],   data ),
            buildtask: Object.assign([],   data )
          })
         }
         if (action.payload.type == 'knowledgereview') {
          let data =    state.knowledgereview.filter(item => item.id !== action.payload.data.id);
          return   Object.assign({}, state, {
            knowledgereview: Object.assign([],   data )
          })
        }
        if (action.payload.type == 'buildtask') {
          let data =    state.knowledgereview.filter(item => item.id !== action.payload.data.id);
          return   Object.assign({}, state, {
            buildtask: Object.assign([],   data )
          })
        }
      }
    default:
      return state;
  }
}



export function TaskBuildReducer(state: any = initialStateBuildTask, action: TaskAction) {
  switch (action.type) {
    case TaskActionTypes.BUILD_TASK:
    {

      return     Object.assign([], action.payload  )
    }
    default : 
    return state
  }

}