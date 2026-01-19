/**
 * This file is a part of the Main chain Project
 *
 *
 * @author Haythem Barrani
 * @copyright 2023 Vistory – Building bridges. All Rights Reserved.
 */
require('dotenv').config({
    path: require('minimist')(process.argv.slice(2)).envpath || '.env'
});
const express = require('express');
const app = express();
const morgan = require('morgan')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const cors = require('cors');
const helmet = require("helmet");
const http = require('http');
const db = require('./src/config/database/mariadb_connection');
const appFun = require('./src/services/utils_services/appFunctions');
const web3 = require('./src/web3_classes/web3_properties');
const { migration_process } = require('./src/services/utils_services/migration_srv');
const logger = require('./src/utils/elasticSearch/logger2.js');

/***********ROUTES API FOR PORTAL IMPORTS**********************************************/
const sites_routes = require('./src/routes/Site_routes');
const login_routes = require('./src/routes/Login_routes');
const printers_routes = require('./src/routes/Printer_routes');
const industrials_routes = require('./src/routes/Industrial_routes');
const bubbles_routes = require('./src/routes/Bubble_routes');
const tokens_routes = require('./src/routes/Token_routes');
const plans_routes = require('./src/routes/Plans_routes');
const job_orders_routes = require('./src/routes/Job_order_routes');
const structures_routes = require('./src/routes/Structures_routes');
const plan_parts_routes = require('./src/routes/Plan_parts_routes');
const eco_model_routes = require('./src/routes/Eco_Model_routes');
const quality_control_routes = require('./src/routes/Quality_control_routes');
const dashboard_routes = require('./src/routes/Dashboard_routes');
const production_order_routes = require('./src/routes/Production_order_routes.js');
const user_routes = require('./src/routes/User_routes');
const email_routes = require('./src/routes/Email_routes');
const planning_routes = require('./src/routes/Planning_routes');
const prototype_order_routes = require('./src/routes/Prototype_order_routes.js');
const material_routes = require('./src/routes/material_routes.js');
const stripeRoutes = require('./src/routes/Stripe_routes.js');
const categories_routes = require('./src/routes/categories_routes.js');
const objects_routes = require('./src/routes/objects_routes.js');
const printer_type_routes = require('./src/routes/Printer_type_routes.js');
/***********ROUTES API FOR PORTAL IMPORTS  END  END END*********************************/

/*************ROUTES API FOR AGENT IMPORTS  ****************************************************/
const login_agent_routes = require('./src/routes/Developpeur_routes/Agent_login_routes');
const printers_agent_routes = require('./src/routes/Agent_routes/Printers_agent_routes.js');
const bubble_agent_routes = require('./src/routes/Agent_routes/bubble_agent_routes');
const plans_agent_routes = require('./src/routes/Agent_routes/plans_agent_routes');
const job_orders_agent_routes = require('./src/routes/Agent_routes/Job_order_agent_routes');
const history_agent_routes = require('./src/routes/Agent_routes/history_agent_routes');
const prototype_order_agent_routes = require('./src/routes/Agent_routes/prototype_order_agent_routes');
const test_agent_routes = require('./src/routes/Agent_routes/test_agent_routes');
/*************ROUTES API FOR AGENT IMPORTS  END END END**********************************************/

/*************ROUTES API FOR DEVELOPPEURS IMPORTS  ****************************************************/
const bubbles_dev_routes = require('./src/routes/Developpeur_routes/Bubbles_dev_routes');
const sites_dev_routes = require('./src/routes/Developpeur_routes/Sites_dev_routes');
const plans_dev_routes = require('./src/routes/Developpeur_routes/Plans_dev_routes.js');
const users_dev_routes = require('./src/routes/Developpeur_routes/Users_dev_routes.js');
const industrial_dev_routes = require('./src/routes/Developpeur_routes/industrial_dev_routes.js');
const workspaces_dev_routes = require('./src/routes/Developpeur_routes/Workspaces_dev_routes.js');
const categories_dev_routes = require('./src/routes/Developpeur_routes/Categories_dev_routes.js');
const printers_dev_routes = require('./src/routes/Developpeur_routes/Printers_dev_routes.js');
const job_orders_dev_routes = require('./src/routes/Developpeur_routes/Job_order_dev_routes.js');
const production_orders_dev_routes = require('./src/routes/Developpeur_routes/Production_order_dev_routes.js');
/*************ROUTES API FOR DEVELOPPEURS IMPORTS  END END END**********************************************/

/*************** ROUTES WS CATALOGUES ************************/
const wsCatalogueRoutes = require('./src/routes/WsCatalogues/wsCatalogueRoutes')

app.use(express.urlencoded({
    limit: '20mb',
    extended: true
}));
app.use(express.json({ limit: '20mb', extended: true }));

app.use(
    morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
    })
)

const jwt = require('./src/auth/jwt_auth');
const superAdminTokenGenerator = require('./src/utils/superAdminTokenGenerator.js');
const { setAllJobOrderHashId } = require('./src/services/JobOrderServices.js');
const { HttpStatusCode } = require('axios');
app.use(jwt.verifyServerToken);
app.use(helmet());
app.use(cors());
app.use(multipartMiddleware);
app.use(appFun.onConnection);
app.use(appFun.logResponseTime);
app.use(appFun.handleBodyError);
app.disable('x-powered-by');
app.use(express.static('resources'));

/***************Routes API for Portail Users************** */
app.use('/api/sites', sites_routes);
app.use('/api/login', login_routes);
app.use('/api/printers', printers_routes);
app.use('/api/industrials', industrials_routes);
app.use('/api/bubbles', bubbles_routes);
app.use('/api/tokens', tokens_routes);
app.use('/api/plans', plans_routes);
app.use('/api/job-orders', job_orders_routes);
app.use('/api/structures', structures_routes);
app.use('/api', plan_parts_routes);
app.use('/api', eco_model_routes);
app.use('/api/quality_controls', quality_control_routes);
app.use('/api/dashboards', dashboard_routes);
app.use('/api/production_orders', production_order_routes);
app.use('/api/users', user_routes);
app.use('/api/emails', email_routes);
app.use('/api/planning', planning_routes);
app.use('/api/prototype_orders', prototype_order_routes);
app.use('/api/materials', material_routes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/categories', categories_routes);
app.use('/api/objects', objects_routes);
app.use('/api/printer_type', printer_type_routes);

/***************Routes API for Portail Users END************** */

/**********Routes API for AGENT **************************** */
app.use('/api/agent/printers', printers_agent_routes);
app.use('/api/agent/user/auth', login_agent_routes);
app.use('/api/agent/bubbles', bubble_agent_routes);
app.use('/api/agent/plans', plans_agent_routes);
app.use('/api/agent/job-orders', job_orders_agent_routes);
app.use('/api/agent/histories', history_agent_routes);
app.use('/api/agent/prototype_orders', prototype_order_agent_routes);
app.use('/api/agent/servers', test_agent_routes);
/**********Routes API for AGENT END**************************** */



/***********ROUTES API FOR DEV **********************************/
app.use('/api/dev/bubbles', bubbles_dev_routes);
app.use('/api/dev/sites', sites_dev_routes);
app.use('/api/dev/plans', plans_dev_routes);
app.use('/api/dev/users', users_dev_routes);
app.use('/api/dev/industrials', industrial_dev_routes);
app.use('/api/dev/workspaces', workspaces_dev_routes);
app.use('/api/dev/categories', categories_dev_routes);
app.use('/api/dev/printers', printers_dev_routes);
app.use('/api/dev/job-orders', job_orders_dev_routes);
app.use('/api/dev/production-orders', production_orders_dev_routes);
/***********ROUTES API FOR DEV END **********************************/

/****** ROUTES API FOR WS CATALOGUES */
app.use('/api/ws_catalogues', wsCatalogueRoutes)

/* ROUTE NOT FOUND */
app.use('*', (req, res, next) => {
    const method = req.method
    const path = req.originalUrl
    logger.error(`[SERVER]: Route not found - ${method} ${path}`)
    return res.status(HttpStatusCode.NotFound).send({
        message: 'Route not found',
        method,
        path
    })
})

// handle runtime errors
process.on('uncaughtException', function (err) {
    // handle the error safely
    console.error(err)
})

const server = http.createServer(app);

(async () => {
    try {
        await Promise.all([
            migration_process(),
            db.connectToServer(),
            web3.web3_1.eth.getAccounts()
        ]);

        superAdminTokenGenerator();
        setAllJobOrderHashId()

        logger.info("MainChain DB connection is established");
        logger.info("Web3 connection is established");

        server.listen(process.env.HTTPS_PORT, process.env.HTTPS_IP, () => {
            logger.info(`Server is listening on: ${process.env.HTTPS_IP}:${process.env.HTTPS_PORT}`);
        }).timeout = 600000;

    } catch (e) {
        logger.error(e.message);
        process.exit(1);
    }
})();