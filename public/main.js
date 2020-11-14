const tFDescription = document.getElementById('iDescription')
const btnSubmit  = document.getElementById('btnSubmit');
const  btnFetch = document.getElementById('btnFetch');
const  radResNo = document.getElementById('iResourcesNo');
const  radResYes = document.getElementById('iResourcesYes');
const  radImpNo = document.getElementById('iImportantNo');
const  radImpYes = document.getElementById('iImportantYes');
const  optTeacher = document.getElementById('iTeacher');
const  optSubject = document.getElementById('iSubject');
const  dateAssigned = document.getElementById('iAssignedDate');
const  dateDue = document.getElementById('iDueDate');
const  numDur = document.getElementById('iDuration');
const  txtTaskName = document.getElementById('iTaskName');
const  tFSummary = document.getElementById('iTaskSum');
const checkResources = document.getElementById("checkResources");
const checkImportant = document.getElementById('checkImportant');




let fetchData = function(){
    let summary = tFSummary.value;
    let lines = summary.split('\n').filter((str) => /\S/.test(str));
    let words = new Array();
    let taskDescription = "";
    for (item of lines){
         words.push(item.split(' '));
         let index = lines.length-3;
         for (let i = 8; i < index; i++){
            if (item == lines[i]){
                taskDescription += item + '\n';
            }
        }
    }
    let ind = 5;
    if(words[5][0]=="Submit"){
        ind += 1;
    }
    let teacher = words[ind][3];
    let subject = words[ind][11];

    let approvedSubjects = ["Maths","Physics","Computing","F. Maths"];
    console.log(subject);
    if(subject == "f" || subject == "F"){
        subject = "F. Maths";
    }
    if(!(approvedSubjects.includes(subject.trim()))){
        subject = "Other";
    }
    

    let setOn = words[ind+1][3] + "\xa0" +words[ind+1][4];
    let dueOn = words[ind+1][8] + "\xa0" +words[ind+1][9];

    let timeTakes = words[words.length-2][5];
    if (timeTakes < 10){
        timeTakes *= 60;
    }
    let taskName = lines[0];
    sendRequest(taskName,taskDescription,checkResources.checked,checkImportant.checked,teacher,subject,setOn,dueOn,timeTakes);
    checkImportant.checked = false;
    checkResources.checked = false;
    tFSummary.value="";
}

let validate = function(){
    taskName = txtTaskName.value;
    description = tFDescription.value;
    isResources= radResYes.checked;
    isImportant= radImpYes.checked;
    teacher = optTeacher.value;
    subject = optSubject.value;
    dateSet = dateAssigned.value;
    dateOn = dateDue.value;
    duration = numDur.value;
    sendRequest(taskName,description,isResources,isImportant,teacher,subject,dateSet,dateOn,duration);
    txtTaskName.textContent = "";
    tFDescription.textContent = "";


}

btnFetch.onclick = fetchData;
btnSubmit.onclick = validate;


let sendRequest = async function(taskName,description,isResources=false,isImportant=false,teacher,subject,dateAssigned,dateDue,duration){
    const data = {
        taskName: taskName,
        taskDescription: description,
        resources: isResources,
        important: isImportant,
        teacher: teacher,
        subject: subject,
        dateAssigned: dateAssigned,
        dateDue: dateDue,
        duration: duration
    };
    const options = {
        method : 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    };
    const resp = await fetch('/api',options);
    const json = await resp.json()
    document.getElementById('addedSuccess').hidden = false;
    setTimeout(()=>{
        document.getElementById('addedSuccess').hidden = true;
    },2000);
}