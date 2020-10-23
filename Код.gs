
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.commandsFile = {})));
}(this, (function (exports) {'use strict';
//===============================================
function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }
//================================================
function getFile(url_id) { return DriveApp.getFileById(getIdFromUrl(url_id)) }

const addEditors = (file, emails) => { try { return file.addEditors(emails) } catch (e) {} };
const addViewers = (file, emails) => { try { return file.addViewers(emails) } catch (e) {} };
const addCommenters = (file, emails) => { try { return file.addCommenters(emails) } catch (e) {} };
//====================================================
const removeEditor = (file, email) => { try { file.removeEditor(email) } catch (e) {} };
const removeViewer = (file, email) => { try { file.removeViewer(email) } catch (e) {} };
const removeCommenter = (file, email) => { try { file.removeCommenter(email) } catch (e) {} };
const removeAll = (file, email) => [removeEditor, removeViewer, removeCommenter].map(fn => fn(file, email))

function removeAllEmails(file, emails) {
    emails.map(email => removeAll(file, email))
}
//=========================================================================
const getEmail = user => user.getEmail()
const curryGetFileMetod = (file, emails, metod) => (emails, metod) => Object.assign(emails, {
    [metod]: ('get' + metod)(file).map(getEmail)
})
const getFileMetod = curryGetFileMetod(file)
    //============================================================================
const getEditors = (file) => file.getEditors().map(getEmail)
const getViewers = (file) => file.getViewers().filter(user => file.getAccess(user) != "COMMENT").map(getEmail)
const getCommenters = (file) => file.getViewers().filter(user => file.getAccess(user) == "COMMENT").map(getEmail)
const getUsersFile = (file) => ['Editors', 'Viewers', 'Commenters'].reduce(getFileMetod, {})
    //================================================================================
const getLastUpdated = (file) => file.getLastUpdated()
var getCommands =()=>{return {
        ['edit']: addEditors,
        ['view']: addViewers,
        ['comment']: addCommenters,
        ['del']: removeAllEmails,
        ['users']: getCommenters,
        ['ubdate']: getLastUpdated,
    }
    }
    var getMsgCommands = ()=>{
    return {
        ['edit']: `Пользователь Вам предоставлен доступ на редактирование для таблицы `,
        ['view']: `Пользователь Вам предоставлен доступ на просмотр для таблицы `,
        ['comment']: `Пользователь Вам предоставлен доступ на редактирование для таблицы `,
        ['del']: `Пользователь Вам закрыт доступ  для таблицы `,
        ['users']: getCommenters,
        ['ubdate']: getLastUpdated,
    }
}

//==========================================================

function commandsFileShare(command, url_id, strEmails) {
    var emails = strEmails.split(",")
    var file = getFile(url_id)
    var Commands =getCommands() 
    var msgCommands = getMsgCommands()
    return Commands[command](file, emails)

}
  
exports.getCommands=getCommands
exports.commandsFileShare = commandsFileShare;
Object.defineProperty(exports, '__esModule', { value: true });
})));