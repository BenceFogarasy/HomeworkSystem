let sorting = "taskName";
let currentSubject = "All";
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
async function getData(specifiedData="All"){
    const response = await fetch(`/task?s=${specifiedData}&so={"${sorting}":-1}`);
    const data = await response.json(); 
    let i = 0;
    let root = document.createElement('div');
    root.className="tile is-10"
    for (item of data){
        i += 1;
        
        
        //root limited to max three children

        const taskContainer = document.createElement('div');
        taskContainer.className = "tile  is-parent";

        const box = document.createElement('div');
        box.className = "box ";
        if(item.important == true){
          box.className = "box message is-primary";

        }
        const now = new Date();
        const nowDate = new Date(now.getFullYear(),now.getMonth(),now.getDate());
        const splitDate = item.dateDue.split("\xa0");
        const dateComp = [months.indexOf(splitDate[1]),splitDate[0]];
        const dueDate = new Date(now.getFullYear(),dateComp[0],dateComp[1]);
        const warningDate = nowDate.addDays(3);
        if(dueDate < nowDate){
          console.log("THIS IS LATE");
          box.className = "box message is-danger";
        }else if(dueDate < warningDate){
          console.log("Complete this soon!");
          box.className = "box message is-info";
        }


        
        const mediaArticle = document.createElement('article');
        mediaArticle.className = "media";

        const mediaContent = document.createElement('div');
        mediaContent.className = "media-content ";
        mediaContent.setAttribute("onmousedown","turnImportant(event,this)");

        const content = document.createElement('div');
        content.className = "content";

        
        const pInContent = document.createElement('p');

        const strongSubject = create('strong');
        const smallTeacher = create('small');

        const lineBreak = document.createElement('br');

        strongSubject.textContent = item.subject+ "   ";
        smallTeacher.textContent = item.teacher;

        const taskDescription = create('p',"pDescription");
        taskDescription.textContent = item.taskDescription;

        const levelContainer = create('nav','level');
        const deleteButton = create('div',"level-item level-right");
        const spanDelete = create("span","icon has-text-success");
        const iDelete = create("i","fas fa-check-square");
        const aDelete = create("a");
        aDelete.append(iDelete);
        spanDelete.setAttribute("onClick","clickedMe(this)");
        spanDelete.append(aDelete);
        deleteButton.append(spanDelete);

        const subjTeacherKepper = create('nav',"level-item level-left");
        subjTeacherKepper.append(strongSubject,"\xa0\xa0",smallTeacher);

        levelContainer.append(subjTeacherKepper,deleteButton);
       

        pInContent.append(levelContainer,taskDescription);

        let elements = `<nav class="level is-mobile">
                            <div class="level-left">
                             <a class="level-item" aria-label="reply" hidden=${item.resources}>
                               <span class="icon is-small">
                                 <i class="fas fa-info-circle" aria-hidden="true"></i>
                               </span>
                             </a>
                             <a class="level-item" aria-label="like" hidden=${item.important}>
                               <span class="icon is-small">
                                 <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                               </span>
                             </a>
                             <span  class="level-item">
                                 <p class="is-small">${item.duration}</p>
                             </span>
                           </div>
                           <div>
                             <div>${item.dateAssigned}</div>
                             <div>${item.dateDue}</div>
                           </div>
                         </nav>`;
        
        const navContainer = create('nav',"level is-mobile");
        
        const dateKeeper = create('div');
        const dateAssignedDiv = create('div');
        const dateDueDiv = create('div');
        dateAssignedDiv.textContent = item.dateAssigned;
        dateDueDiv.textContent = item.dateDue;
        dateKeeper.append(dateAssignedDiv,dateDueDiv);

        const divLeft = create("div","level-left");
        const aHolder = create('a',"level-item");

        let visibility = "none";
        let visibility2 = "none";
        if (item.resources)
            visibility = "initial";
        aHolder.style.display = visibility;

        const spanCircle = create('span',"icon, is-large");
        const iconCircle = create('i',"fas 2em fa-2x fa-info-circle");

        const aHolder2 = create('a',"level-item");

        if (item.important)
            visibility2 = "initial";
        aHolder2.style.display = visibility2;

        const spanCircle2 = create('span',"icon, is-large");
        const iconCircle2 = create('i',"fas 2em fa-2x fa-exclamation-triangle");

        spanCircle2.append(iconCircle2);
        aHolder2.append(spanCircle2);

        const spanDurContainer = create('span','level-item');
        const pStrong = create('strong');
        const pDuration = create('p','is-small');
        pDuration.textContent = item.duration;
        pDuration.append(" mins.");
        pStrong.append(pDuration);
        spanDurContainer.append(pStrong);

        spanCircle.append(iconCircle);
        aHolder.append(spanCircle);
        divLeft.append(aHolder,aHolder2,spanDurContainer);
        navContainer.append(divLeft,dateKeeper);
        

        content.append(pInContent);
        mediaContent.append(content,navContainer);

        mediaArticle.append(mediaContent);
        box.append(mediaArticle);
        taskContainer.append(box);
        root.append(taskContainer);



        if (i==3){
            root = document.createElement('div');
            root.className="tile is-10"
            root.append(taskContainer);
            i=0;
        }

        document.getElementById('container').append(root);
    }
 }

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

let create = function(tag,classes=""){
    let element = document.createElement(tag);
    element.className= classes;
    return element;
}
const clickedMe = async function(btn){
    confirm("Delete it?");
    let txtContent = btn.parentElement.parentElement.parentElement.getElementsByClassName("pDescription")[0].textContent;
    const message = {delete: txtContent};
    const options = {
        method : 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(message)
    };
    const response = await fetch('/delete',options);
    const data = await response.json(); 
    console.log(data);
    btn.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
}

const sortChange = function(a){
    let actives = document.getElementById('sortingActive').children;
    for(item of actives){
      item.className = "panel-block";
    }
    a.className="is-active panel-block"
    sorting = a.textContent.trim();
    document.getElementById('container').textContent = "";
    getData(currentSubject);
}

const view = async function(element,subj){
    let actives = document.getElementById('subjectsActive').children;
    for(item of actives){
      item.className = "";
    }
    element.className="is-active "
    document.getElementById('container').textContent = "";
    currentSubject = subj;
    getData(subj);
}

const turnImportant = async function(ev,div){
    const divContent = div.children[0].children[0].children[1].textContent;
    if(ev.button==1){
      console.log("Got here");
      const message = {update: divContent};
      const options = {
          method : 'POST',
          headers: {
              "Content-Type": 'application/json'
          },
          body: JSON.stringify(message)
      };
      const response = await fetch('/update',options);
      const data = await response.json(); 
      console.log(data);
    }
    

}

getData("All");
 /*
 
 {
    taskName: taskName,
    taskDescription: description,
    resources: isResources,
    important: isImportant,
    teacher: teacher,
    subject: subject,
    dateAssigned: dateAssigned,
    dateDue: dateDue,
    duration: duration
}
 */ 