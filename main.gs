const ss = SpreadsheetApp.getActiveSpreadsheet();

function doGet() {
  const html = HtmlService.createTemplateFromFile('index').evaluate();
  html.setTitle('R03授業見学コメント');
  return html;
}

function getUserId() {
  const id = Session.getActiveUser().getUserLoginId();
  return id;
}

function getSubjectList() {
  const sheet = ss.getSheetByName('subject');
  const subjectList = sheet.getDataRange().getValues();
  subjectList.shift();
  console.log(subjectList);
  return subjectList;
}

function getTeacherList() {
  const sheet = ss.getSheetByName('teacher');
  const teacherList = sheet.getDataRange().getValues();
  teacherList.shift();
  const teacherObjList = teacherList.map(arr => {
    return {mail: arr[0], name: arr[1], subject: arr[2]};
  })
  return teacherObjList;
}

function getClassList() {
  const sheet = ss.getSheetByName('class');
  const classList = sheet.getDataRange().getValues();
  classList.shift();
  return classList;
}

function insertToSpreadSheet(obj) {
  const sheet = ss.getSheetByName('comment');
  const timeStamp = new Date();
  const array = [
    timeStamp,
    obj.mail,
    クラス,
    obj.subject,
    obj.teacher,
    obj.good,
    obj.improved
  ];
  console.log(array);
  sheet.appendRow(array);
  
}

