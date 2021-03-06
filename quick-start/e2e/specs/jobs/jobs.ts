import { browser, ExpectedConditions as EC } from 'protractor';
import dashboardPage from '../../page-objects/dashboard/dashboard';
import flowPage from '../../page-objects/flows/flows';
import jobsPage from '../../page-objects/jobs/jobs';
import appPage from '../../page-objects/appPage';

export default function() {
    describe('Run Jobs', () => {
      it ('should go to jobs page', function() {
        appPage.jobsTab.click();
        jobsPage.isLoaded();
      });

      it ('should count the jobs', function() {
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 6 of 6');
        //verfiy on dashboard page
        appPage.dashboardTab.click();
        dashboardPage.isLoaded();
        //count jobs and traces
        expect(dashboardPage.jobCount().getText()).toEqual('2,258');
        appPage.jobsTab.click();
        jobsPage.isLoaded();
      });

      it ('search only harmonize jobs', function() {
        jobsPage.facetButton('harmonize').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 1 of 1');
      });

      it ('search only input jobs', function() {
        jobsPage.removeFacetButton('harmonize').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        jobsPage.facetButton('input').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 5 of 5');
      });

      it ('search with facet for finished jobs', function() {
        jobsPage.removeFacetButton('input').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        jobsPage.facetButton('FINISHED').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 6 of 6');
        jobsPage.removeFacetButton('FINISHED').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 6 of 6');
      });

      it ('search with facet for TestEntity jobs', function() {
        jobsPage.facetButton('TestEntity').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 4 of 4');
        jobsPage.removeFacetButton('TestEntity').click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 6 of 6');
      });

      it ('check and export some jobs', function() {
        jobsPage.jobCheckboxByPosition(5).click();
        jobsPage.jobCheckboxByPosition(3).click();
        jobsPage.actionDropDown().click();
        browser.wait(EC.elementToBeClickable(jobsPage.exportActionMenuItem()));
        jobsPage.exportActionMenuItem().click();
        browser.wait(EC.elementToBeClickable(jobsPage.exportButton()));
        jobsPage.exportButton().click();
        browser.refresh();
      });

      it ('check and delete some jobs', function() {
        //reset the checkboxes by going to another tab
        appPage.flowsTab.click();
        flowPage.isLoaded();
        appPage.jobsTab.click();
        jobsPage.isLoaded();
        //verify to delete some jobs
        jobsPage.jobCheckboxByPosition(1).click();
        jobsPage.jobCheckboxByPosition(2).click();
        jobsPage.actionDropDown().click();
        browser.wait(EC.elementToBeClickable(jobsPage.deleteActionMenuItem()));
        jobsPage.deleteActionMenuItem().click();
        browser.wait(EC.elementToBeClickable(jobsPage.deleteButton()));
        jobsPage.deleteButton().click();
        browser.wait(EC.visibilityOf(jobsPage.jobResults()));
        expect(jobsPage.jobResults().getText()).toContain('Showing Results 1 to 4 of 4');
        //verify on dashboard page
        appPage.dashboardTab.click();
        dashboardPage.isLoaded();
        //count jobs and traces
        expect(dashboardPage.jobCount().getText()).toEqual('1,356');
        appPage.jobsTab.click();
        jobsPage.isLoaded();
      });
    });
  }
