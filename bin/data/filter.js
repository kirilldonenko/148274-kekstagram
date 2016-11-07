'use strict';

module.exports = function(list, filterID) {
  switch (filterID) {
    case 'filter-new':
      return list.filter(function(item) {
        return item.created > Date.now() - 3 * 24 * 60 * 60 * 1000;
      }).sort(function(a, b) {
        return b.created - a.created;
      });
      break;
    case 'filter-discussed':
      return list.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    default:
      return list.sort(function(a, b) {
        return b.likes - a.likes;
      });
  }
};
