import Connect from "connect-pg-simple";
import session from "express-session";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { app } from "../../main.js";
import prisma from "../database/index.js";
import { dark, light, noSidebar } from "@adminjs/themes";
export const generateAdminJS = () => {
  const DEFAULT_ADMIN = {
    email: "admin@example.com",
    password: "password",
  };

  AdminJS.registerAdapter({ Database, Resource });

  const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
  };

  const adminOptions = {
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    resources: [
      {
        resource: { model: getModelByName("User"), client: prisma },
        options: {},
      },
      {
        resource: { model: getModelByName("Tournament"), client: prisma },
        options: {
          properties: {
            tournaments: {
              isVisible: {
                list: true,
                show: true,
                filter: true,
                sort: true,
              },
            },
          },
        },
      },
      {
        resource: { model: getModelByName("Match"), client: prisma },
        options: {
          properties: {
            tournaments: {
              isVisible: {
                list: true,
                show: true,
                filter: true,
                sort: true,
              },
            },
          },
        },
      },
    ],
    branding: {
      logo: "https://i.ibb.co/DznmrKw/Frame-7.png",
      companyName: "TNBMAR",
      favicon: "https://i.ibb.co/HCdHwvt/cube.png",
    },
  };
  const admin = new AdminJS(adminOptions);

  const ConnectSession = Connect(session);
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
    },
    tableName: "session",
    createTableIfMissing: true,
  });
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: "sessionsecret",
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: "sessionsecret",
      name: "adminjs",
    }
  );

  app.use(admin.options.rootPath, adminRouter);
};
