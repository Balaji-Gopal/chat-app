import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
/**
 * Pipe component to filter the list item based on the search string entered in search box
 */
export class FilterPipe implements PipeTransform {
  transform(items: any[], findFriend: string): any[] {
    if ( !items ) {
        return [];
    }
    if (!findFriend) {
        return items;
    }
    findFriend = findFriend.toLowerCase();
    return items.filter( friend => {
      return friend.name.first.toLowerCase().includes(findFriend) || friend.name.last.toLowerCase().includes(findFriend);
    });
   }
}
