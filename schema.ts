import { list } from '@keystone-next/keystone';
import { text, relationship, password, timestamp, select, image, checkbox } from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';

export const lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      isAdmin: checkbox({
        access: {
          // Only Admins can set the isAdmin flag for any users
          create: ({ session }) => session?.data.isAdmin,
          update: ({ session }) => session?.data.isAdmin,
        },
        ui: {
          // All users can see the isAdmin status, only admins can change it
          createView: {
            fieldMode: ({ session }) =>
              session?.data.isAdmin ? "edit" : "hidden",
          },
          itemView: {
            fieldMode: ({ session }) =>
              session?.data.isAdmin ? "edit" : "read",
          },
        },
      }),
      password: password({
        validation: { isRequired: true },
      }),
      bio: text(),
      posts: relationship({ ref: 'Post.author', many: true }),
      events: relationship({ ref: 'Event.hosts', many: true }),
      Linkedin: text(),
      Github: text(),
      Twitter: text(),
    },

    ui: {
      listView: {
        initialColumns: ['name', 'email', 'posts'],
      },
    },
  }),

  Post: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      thumbnail: image(),
      description: text(),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Under Review', value: 'review' },
          { label: 'Draft', value: 'draft' },
        ],
        defaultValue: 'draft',
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      // Here is the link from post => author.
      // We've configured its UI display quite a lot to make the experience of editing posts better.
      author: relationship({
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      // We also link posts to tags. This is a many <=> many linking.
      tags: relationship({
        ref: 'Tag.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
    },
    ui: {
      listView: {
        initialColumns: ['title', 'description', 'author', 'status', 'publishDate'],
      },
    },
  }),
  // Our final list is the tag list. This field is just a name and a relationship to posts
  Tag: list({
    // ui: {
    //   isHidden: true,
    // },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),

  Event: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      date: timestamp(),
      hosts: relationship({
        ref: 'User.events',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
      About: text({ validation: { isRequired: true } }),
      TalkingPoints: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      Thumbnail: image(),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'date', 'hosts'],
      },
    },
  }),
};
