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
} from 'firebase/firestore';

import { PreviewCategory } from '../../store/categories/category.types';

import {
  ItemPreview,
  NewItemValues,
} from '../../components/add-firebase/add-item.component';
import { SortOption } from '../../routes/category/category.component';
import { UserCollectionKeys, db } from './firebase.utils';

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
    const q = query(collectionRef, limit(4));

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
  const collectionRef = collection(db, collectionKey, docKey, 'items-preview');
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
  const isSameSort = equalSortsObjects(sortOption, prevSortOption);
  let skipItemsCounter = 0;
  if (!isSameSort) {
    skipItemsCounter = 0;
  } else {
    skipItemsCounter = itemsCounter;
  }

  // options of sizes selected
  if (sortOption && sortOption.sizes.length > 0) {
    const sortOptionsSizes = sortOption.sizes.map((size) => size.value);

    const itemsQuery = query(
      collectionRef,
      where('sizesSort', 'array-contains-any', sortOptionsSizes)
    );
    const itemsSnapshot = await getDocs(itemsQuery);
    const itemsSortBySizes = itemsSnapshot.docs.map(
      (doc) => doc.data() as ItemPreview
    );
    let sortCount = itemsSortBySizes.length;

    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        itemsSortBySizes.sort(
          (a, b) => a.created.toMillis() - b.created.toMillis()
        );
      }
      if (sortOption.sort.value === 'new') {
        itemsSortBySizes.sort(
          (a, b) => b.created.toMillis() - a.created.toMillis()
        );
      }
      if (sortOption.sort.value === 'price-low') {
        itemsSortBySizes.sort((a, b) => a.price - b.price);
      }
      if (sortOption.sort.value === 'price-high') {
        itemsSortBySizes.sort((a, b) => b.price - a.price);
      }
    }

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

    const itemsQuery = query(
      collectionRef,
      where('colorsSort', 'array-contains-any', sortOptionsColor)
    );
    const itemsSnapshot = await getDocs(itemsQuery);
    const itemsSortByColors = itemsSnapshot.docs.map(
      (doc) => doc.data() as ItemPreview
    );
    const sortCount = itemsSortByColors.length;

    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        itemsSortByColors.sort(
          (a, b) => a.created.toMillis() - b.created.toMillis()
        );
      }
      if (sortOption.sort.value === 'new') {
        itemsSortByColors.sort(
          (a, b) => b.created.toMillis() - a.created.toMillis()
        );
      }
      if (sortOption.sort.value === 'price-low') {
        itemsSortByColors.sort((a, b) => a.price - b.price);
      }
      if (sortOption.sort.value === 'price-high') {
        itemsSortByColors.sort((a, b) => b.price - a.price);
      }
    }

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
    let itemsQuery: Query<DocumentData> = query(collectionRef);
    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        itemsQuery = query(collectionRef, orderBy('created', 'asc'));
      }
      if (sortOption.sort.value === 'new') {
        itemsQuery = query(collectionRef, orderBy('created', 'desc'));
      }
      if (sortOption.sort.value === 'price-low') {
        itemsQuery = query(collectionRef, orderBy('price', 'asc'));
      }
      if (sortOption.sort.value === 'price-high') {
        itemsQuery = query(collectionRef, orderBy('price', 'desc'));
      }
    }
    let next: Query<DocumentData>;
    const itemsSnapshot = await getDocs(itemsQuery);
    const sortCount = (await getCountFromServer(itemsQuery)).data().count;
    const lastVisible = itemsSnapshot.docs[skipItemsCounter];

    next = query(
      collection(db, collectionKey, docKey, 'items-preview'),
      startAt(lastVisible),
      limit(3)
    );

    if (sortOption?.sort.value) {
      if (sortOption.sort.value === 'recommended') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('created', 'asc'),
          startAt(lastVisible),
          limit(3)
        );
      }
      if (sortOption.sort.value === 'new') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('created', 'desc'),
          startAt(lastVisible),
          limit(3)
        );
      }
      if (sortOption.sort.value === 'price-low') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('price', 'asc'),
          startAt(lastVisible),
          limit(3)
        );
      }
      if (sortOption.sort.value === 'price-high') {
        next = query(
          collection(db, collectionKey, docKey, 'items-preview'),
          orderBy('price', 'desc'),
          startAt(lastVisible),
          limit(3)
        );
      }
    }

    const itemQuerySnapshot = await getDocs(next);

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
  let itemsQuery: Query<DocumentData> = query(collectionRef);

  if (sortOption?.sort.value) {
    if (sortOption.sort.value === 'recommended') {
      itemsQuery = query(collectionRef, orderBy('created', 'asc'), limit(3));
    }
    if (sortOption.sort.value === 'new') {
      itemsQuery = query(collectionRef, orderBy('created', 'desc'), limit(3));
    }
    if (sortOption.sort.value === 'price-low') {
      itemsQuery = query(collectionRef, orderBy('price', 'asc'), limit(3));
    }
    if (sortOption.sort.value === 'price-high') {
      itemsQuery = query(collectionRef, orderBy('price', 'desc'), limit(3));
    }
  }

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
  collectionKey: string,
  docKey: string
): Promise<number> {
  const subCollectionRef = collection(
    db,
    collectionKey,
    docKey,
    'items-preview'
  );
  const snapshot = await getCountFromServer(subCollectionRef);

  return snapshot.data().count;
}
