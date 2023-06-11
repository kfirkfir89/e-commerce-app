import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
  startAt,
  getCountFromServer,
  Query,
  DocumentData,
  CollectionReference,
  QueryDocumentSnapshot,
  OrderByDirection,
  doc,
  getDoc,
  DocumentSnapshot,
  startAfter,
  setDoc,
} from 'firebase/firestore';

import { v4 } from 'uuid';
import { PreviewCategory } from '../../store/categories/category.types';

import {
  ItemPreview,
  NewItemValues,
} from '../../components/add-firebase/add-item.component';
import { SortOption } from '../../routes/category/category.component';
import { UserCollectionKeys, db } from './firebase.utils';
import { SelectOption } from '../../components/select/select.component';

// get the user custom subcategories (doc title) by using user custom collectionKeys
export async function getUserKeysDocs(collectionKey: string) {
  const collectionRef = collection(db, collectionKey);
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  const categoryTitles: string[] = [];

  querySnapshot.forEach((doc) => {
    categoryTitles.push(doc.id);
  });

  return categoryTitles;
}
// get the user custom categories (collections keys) and call getUserKeysDocs to get all subCategories
export async function getUserCategories() {
  const collectionRef = collection(db, 'system-data');
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  const data = new Map<string, string[]>();

  const res = querySnapshot.docs.map((docSnapshot) => {
    return docSnapshot.data() as UserCollectionKeys;
  });

  res[0].keys.map(async (k) => {
    const res2 = await getUserKeysDocs(k);
    data.set(k, res2);
  });
  return data;
}

// get preview items for each category for main category page(preview page)
export async function getPreviewCategoriesAndDocuments(collectionKey: string) {
  const userDocsKeys = await getUserKeysDocs(collectionKey);
  const previewArray: PreviewCategory[] = [];
  const data = new Map<string, PreviewCategory[]>();

  const fetchCategoryData = async (docKey: string) => {
    const collectionRef = collection(
      db,
      collectionKey,
      docKey,
      'items-preview'
    );
    const q = query(collectionRef, limit(8));

    const querySnapshot = await getDocs(q);

    const previewCategoryItems: ItemPreview[] = querySnapshot.docs.map(
      (docSnapshot) => {
        return docSnapshot.data() as ItemPreview;
      }
    );

    const newCategory: PreviewCategory = {
      title: docKey,
      items: previewCategoryItems,
    };

    return newCategory;
  };

  await Promise.all(
    userDocsKeys.map(async (docKey) => {
      const newCategory = await fetchCategoryData(docKey);
      previewArray.push(newCategory);
    })
  );

  if (previewArray.length > 0) {
    data.set(collectionKey, previewArray);
  }
  return data;
}

export type CategoryDataSlice = {
  collectionMapKey: string;
  title: string;
  sliceItems: ItemPreview[];
  count: number;
};

// loading more data to category
export async function getSubCategoryDocument(
  collectionKey: string,
  docKey: string,
  itemsCounter: number,
  sortOption: SortOption,
  prevSortOption: SortOption
): Promise<CategoryDataSlice> {
  function equalSortsObjects(
    sortOption: SortOption,
    prevSortOption: SortOption
  ): boolean {
    if (
      JSON.stringify(sortOption.sort) === JSON.stringify(prevSortOption.sort) &&
      JSON.stringify(sortOption.sizes) ===
        JSON.stringify(prevSortOption.sizes) &&
      JSON.stringify(sortOption.colors) ===
        JSON.stringify(prevSortOption.colors)
    ) {
      return true;
    }
    return false;
  }
  function sortByValue(itemSortBy: ItemPreview[]) {
    if (sortOption.sort.value === 'recommended') {
      itemSortBy.sort((a, b) => a.created.toMillis() - b.created.toMillis());
    }
    if (sortOption.sort.value === 'new') {
      itemSortBy.sort((a, b) => b.created.toMillis() - a.created.toMillis());
    }
    if (sortOption.sort.value === 'price-low') {
      itemSortBy.sort((a, b) => a.price - b.price);
    }
    if (sortOption.sort.value === 'price-high') {
      itemSortBy.sort((a, b) => b.price - a.price);
    }
    return itemSortBy;
  }
  function createQuery(collectionRef: CollectionReference<DocumentData>) {
    let itemsQuery = query(collectionRef);
    let sortField = '';
    let sortOrder: OrderByDirection | undefined;

    if (sortOption.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        sortField = 'created';
        sortOrder = 'asc';
      }
      if (sortOption.sort.value === 'new') {
        sortField = 'created';
        sortOrder = 'desc';
      }
      if (sortOption.sort.value === 'price-low') {
        sortField = 'price';
        sortOrder = 'asc';
      }
      if (sortOption.sort.value === 'price-high') {
        sortField = 'price';
        sortOrder = 'desc';
      }
    }

    if (!docKey) {
      if (!sortField && !sortOrder) {
        itemsQuery = query(
          collectionRef,
          where('collectionKey', '==', collectionKey)
        );
        return itemsQuery;
      }
      itemsQuery = query(
        collectionRef,
        where('collectionKey', '==', collectionKey),
        orderBy(sortField, sortOrder)
      );
    }

    if (sortField && sortOrder) {
      itemsQuery = query(collectionRef, orderBy(sortField, sortOrder));
    }
    return itemsQuery;
  }
  function createLimitedQuery(
    collectionRef: CollectionReference<DocumentData>,
    lastVisible?: QueryDocumentSnapshot<DocumentData>
  ) {
    let queryItems: Query<DocumentData>;
    let sortField = '';
    let sortOrder: OrderByDirection | undefined;

    if (sortOption.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        sortField = 'created';
        sortOrder = 'asc';
      }
      if (sortOption.sort.value === 'new') {
        sortField = 'created';
        sortOrder = 'desc';
      }
      if (sortOption.sort.value === 'price-low') {
        sortField = 'price';
        sortOrder = 'asc';
      }
      if (sortOption.sort.value === 'price-high') {
        sortField = 'price';
        sortOrder = 'desc';
      }
    }

    if (!lastVisible) {
      if (!docKey) {
        if (!sortField && !sortOrder) {
          queryItems = query(
            collectionRef,
            where('collectionKey', '==', collectionKey),
            limit(3)
          );
        }
        queryItems = query(
          collectionRef,
          where('collectionKey', '==', collectionKey),
          orderBy(sortField, sortOrder),
          limit(3)
        );
        return queryItems;
      }

      if (!sortField && !sortOrder) {
        queryItems = query(collectionRef, limit(3));
        return queryItems;
      }

      queryItems = query(
        collectionRef,
        orderBy(sortField, sortOrder),
        limit(3)
      );

      return queryItems;
    }

    let next: Query<DocumentData> = query(
      collectionRef,
      startAt(lastVisible),
      limit(3)
    );

    if (!docKey) {
      if (!sortField && !sortOrder) {
        next = query(
          collectionRef,
          where('collectionKey', '==', collectionKey),
          startAt(lastVisible),
          limit(3)
        );
        return next;
      }
      next = query(
        collectionRef,
        where('collectionKey', '==', collectionKey),
        orderBy(sortField, sortOrder),
        startAt(lastVisible),
        limit(3)
      );
      return next;
    }

    if (!sortField && !sortOrder) {
      next = query(collectionRef, startAt(lastVisible), limit(3));
      return next;
    }

    next = query(
      collectionRef,
      orderBy(sortField, sortOrder),
      startAt(lastVisible),
      limit(3)
    );
    return next;
  }

  const isSameSort = equalSortsObjects(sortOption, prevSortOption);
  let skipItemsCounter = 0;
  if (!isSameSort) {
    skipItemsCounter = 0;
  } else {
    skipItemsCounter = itemsCounter;
  }
  let collectionRef: CollectionReference<DocumentData>;
  let itemsQuery: Query<DocumentData>;

  if (!docKey) {
    collectionRef = collection(db, 'all-items-preview');
  } else {
    collectionRef = collection(db, collectionKey, docKey, 'items-preview');
  }

  // options of sizes selected
  if (sortOption && sortOption.sizes.length > 0) {
    // if (sortOption.colors.length > 0) {
    //   const sortOptionColors = sortOption.colors.map((color) => color.label);
    // }
    const sortOptionsSizes = sortOption.sizes.map((size) => size.value);

    if (!docKey) {
      itemsQuery = query(
        collectionRef,
        where('collectionKey', '==', collectionKey),
        where('sizesSort', 'array-contains-any', sortOptionsSizes)
      );
    } else {
      itemsQuery = query(
        collectionRef,
        where('sizesSort', 'array-contains-any', sortOptionsSizes)
      );
    }
    const itemsSnapshot = await getDocs(itemsQuery);
    const itemsSortBySizes = itemsSnapshot.docs.map(
      (doc) => doc.data() as ItemPreview
    );
    let sortCount = itemsSortBySizes.length;

    // const sortOptionsSizesAndColors = itemsSortBySizes[0].sizesSort.flatMap(
    //   (size) =>
    //     itemsSortBySizes[0].colors.map((color) => `${size}-${color.label}`)
    // );

    sortByValue(itemsSortBySizes);

    // when colors selected filter after the sizes
    if (sortOption.colors.length > 0) {
      const filteredByColors = itemsSortBySizes.filter((item) =>
        item.stock.some((sizeStock) =>
          sizeStock.colors.some(
            (colorStock) =>
              sortOption.colors.some(
                (sortColor) => sortColor.label === colorStock.label
              ) && colorStock.count > 0
          )
        )
      );

      sortCount = filteredByColors.length;
      const slice = filteredByColors.slice(
        skipItemsCounter,
        skipItemsCounter + 3
      );

      const categoryData: CategoryDataSlice = {
        collectionMapKey: collectionKey,
        title: docKey,
        sliceItems: slice,
        count: sortCount,
      };
      return categoryData;
    }

    const slice = itemsSortBySizes.slice(
      skipItemsCounter,
      skipItemsCounter + 3
    );
    const categoryData: CategoryDataSlice = {
      collectionMapKey: collectionKey,
      title: docKey,
      sliceItems: slice,
      count: sortCount,
    };
    return categoryData;
  }

  // options of colors selected
  if (sortOption && sortOption.colors.length > 0) {
    const sortOptionsColor = sortOption.colors.map((color) => color.label);
    collectionRef = collection(db, collectionKey, docKey, 'items-preview');

    if (!docKey) {
      itemsQuery = query(
        collectionRef,
        where('collectionKey', '==', collectionKey),
        where('colorsSort', 'array-contains-any', sortOptionsColor)
      );
    } else {
      itemsQuery = query(
        collectionRef,
        where('colorsSort', 'array-contains-any', sortOptionsColor)
      );
    }
    const itemsSnapshot = await getDocs(itemsQuery);
    const itemsSortByColors = itemsSnapshot.docs.map(
      (doc) => doc.data() as ItemPreview
    );
    const sortCount = itemsSortByColors.length;

    sortByValue(itemsSortByColors);

    const categoryData: CategoryDataSlice = {
      collectionMapKey: collectionKey,
      title: docKey,
      sliceItems: itemsSortByColors.slice(
        skipItemsCounter,
        skipItemsCounter + 3
      ),
      count: sortCount,
    };

    return categoryData;
  }

  // same sort mean load more check for main sort desc/asc
  if (isSameSort) {
    itemsQuery = createQuery(collectionRef);

    const itemsSnapshot = await getDocs(itemsQuery);
    const sortCount = (await getCountFromServer(itemsQuery)).data().count;
    const lastVisible = itemsSnapshot.docs[skipItemsCounter];

    const nextItemsQuery: Query<DocumentData> = createLimitedQuery(
      collectionRef,
      lastVisible
    );

    const itemQuerySnapshot = await getDocs(nextItemsQuery);

    const sliceItemsArray: ItemPreview[] = itemQuerySnapshot.docs.map(
      (docSnapshot) => {
        const item = docSnapshot.data() as ItemPreview;
        return item;
      }
    );

    const categoryData: CategoryDataSlice = {
      collectionMapKey: collectionKey,
      title: docKey,
      sliceItems: sliceItemsArray,
      count: sortCount,
    };
    return categoryData;
  }

  // in case of changing sort without sort option of colors or sizes
  itemsQuery = createLimitedQuery(collectionRef);

  const itemsSnapshot = await getDocs(itemsQuery);
  const sortCount = (await getCountFromServer(collectionRef)).data().count;
  const sliceItemsArray: ItemPreview[] = itemsSnapshot.docs.map(
    (docSnapshot) => {
      const item = docSnapshot.data() as ItemPreview;
      return item;
    }
  );

  const categoryData: CategoryDataSlice = {
    collectionMapKey: collectionKey,
    title: docKey,
    sliceItems: sliceItemsArray,
    count: sortCount,
  };
  return categoryData;
}

// get all items search
export async function getItemsSearch(): Promise<ItemPreview[]> {
  const collectionRef = collection(db, 'all-items-preview');

  const itemsQuery = query(collectionRef, orderBy('id'));
  const itemsQuerySnapshot = await getDocs(itemsQuery);
  const result: ItemPreview[] = itemsQuerySnapshot.docs.map(
    (doc) => doc.data() as ItemPreview
  );

  return result;
}

// featch item when using click direct link or typing path in broswer search (singel item)
export async function getItemFromRoute(
  collectionKey: string,
  docKey: string,
  itemSlug: string
): Promise<NewItemValues | undefined> {
  const collectionRef = collection(db, collectionKey, docKey, 'items');
  const itemQuery = query(collectionRef, where('slug', '==', itemSlug));
  const itemQuerySnapshot = await getDocs(itemQuery);
  if (itemQuerySnapshot.docs.length > 0) {
    const CategoryItem = itemQuerySnapshot.docs[0].data() as NewItemValues;
    return CategoryItem;
  }
}

export async function getCategoryCount(
  collectionKey?: string,
  docKey?: string
): Promise<number> {
  if (collectionKey && docKey) {
    const subCollectionRef = collection(
      db,
      collectionKey,
      docKey,
      'items-preview'
    );
    const snapshot = await getCountFromServer(subCollectionRef);

    return snapshot.data().count;
  }

  const collectionRef = collection(db, 'all-items-preview');
  const counterSnapshot = await getCountFromServer(collectionRef);
  const { count } = counterSnapshot.data();
  return count;
}

export async function getProductListItemPreview(
  page: number
): Promise<ItemPreview[]> {
  console.log('page:', page);
  let pagesItemsToSkip = 0;
  const collectionRef = collection(db, 'all-items-preview');
  let itemsQuery: Query<DocumentData>;
  if (page === 1) {
    itemsQuery = query(collectionRef, orderBy('created', 'desc'), limit(2));
    const itemsQuerySnapshot = await getDocs(itemsQuery);
    const itemsSlice: ItemPreview[] = itemsQuerySnapshot.docs.map(
      (doc) => doc.data() as ItemPreview
    );
    return itemsSlice;
  }
  pagesItemsToSkip = (page - 1) * 2;
  itemsQuery = query(
    collectionRef,
    orderBy('created', 'desc'),
    // startAfter(lastVisible),
    limit(pagesItemsToSkip)
  );

  const itemsQuerySnapshot = await getDocs(itemsQuery);
  const itemsSlice: ItemPreview[] = itemsQuerySnapshot.docs.map(
    (doc) => doc.data() as ItemPreview
  );

  const newLaslastVisibletVisible =
    itemsQuerySnapshot.docs[itemsSlice.length - 1];
  const finalItemsQuery = query(
    collectionRef,
    orderBy('created', 'desc'),
    startAfter(newLaslastVisibletVisible),
    limit(2)
  );

  const finalItemsQuerySnapshot = await getDocs(finalItemsQuery);
  const finalItemsSlice: ItemPreview[] = finalItemsQuerySnapshot.docs.map(
    (doc) => doc.data() as ItemPreview
  );
  return finalItemsSlice;
}

// category sort option for the filter section
// used to show the the sort type of sizes that used in a specific category
type SubCategoryDocData = {
  collectionKey: string;
  docKey: string;
  sizeSortOption: SelectOption;
};
export async function getCategorySortOption(
  collectionKey: string,
  docKey: string
): Promise<SubCategoryDocData> {
  const docRef = doc(db, collectionKey, docKey);
  const docSnapshot = await getDoc(docRef);
  let selectOption: SubCategoryDocData = {
    collectionKey: '',
    docKey: '',
    sizeSortOption: { label: '', value: '' },
  };
  if (docSnapshot.exists()) {
    selectOption = docSnapshot.data() as SubCategoryDocData;
  }
  return selectOption;
}

export async function addNewProductList(
  productListId: string[],
  listTitle: string
) {
  const docRef = doc(db, 'user-products-list', `${listTitle + v4()}`);
  await setDoc(docRef, {
    title: listTitle,
    productList: productListId,
  });
}
