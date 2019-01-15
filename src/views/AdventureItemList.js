import React, { Component } from 'react';
import AdventureItem from './AdventureItem';

class AdventureItemList extends Component {
  render() {
    var list = this.props.items.map((item) => {
      return <AdventureItem key={item.key} item={item} />
    });
    return <div>{list.reverse()}</div>;
  }
}

export default AdventureItemList;
