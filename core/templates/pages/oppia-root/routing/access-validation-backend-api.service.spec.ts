// Copyright 2021 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for access validation backend api service.
 */

import { HttpClientTestingModule, HttpTestingController } from
  '@angular/common/http/testing';
import { TestBed, fakeAsync, flushMicrotasks, waitForAsync } from '@angular/core/testing';
import { UrlInterpolationService } from 'domain/utilities/url-interpolation.service';
import { AccessValidationBackendApiService } from './access-validation-backend-api.service';

describe('Access validation backend api service', () => {
  let avbas: AccessValidationBackendApiService;
  let urlInterpolationService: UrlInterpolationService;
  let httpTestingController: HttpTestingController;
  let successSpy: jasmine.Spy;
  let failSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UrlInterpolationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    avbas = TestBed.inject(AccessValidationBackendApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    urlInterpolationService = TestBed.inject(UrlInterpolationService);
    successSpy = jasmine.createSpy('success');
    failSpy = jasmine.createSpy('fail');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should validate access to classroom page', fakeAsync(() => {
    let fragment = 'invalid';
    avbas.validateAccessToClassroomPage(fragment).then(successSpy, failSpy);

    const req = httpTestingController.expectOne(
      '/access_validation_handler/can_access_classroom_page?' +
      'classroom_url_fragment=' + fragment);
    expect(req.request.method).toEqual('GET');
    req.flush({});

    flushMicrotasks();
    expect(successSpy).toHaveBeenCalled();
    expect(failSpy).not.toHaveBeenCalled();
  }));

  it('should validate access to manage user account page', fakeAsync(() => {
    avbas.validateCanManageOwnAccount().then(successSpy, failSpy);

    const req = httpTestingController.expectOne(
      '/access_validation_handler/can_manage_own_account');
    expect(req.request.method).toEqual('GET');
    req.flush({});

    flushMicrotasks();
    expect(successSpy).toHaveBeenCalled();
    expect(failSpy).not.toHaveBeenCalled();
  }));

  it('should validate whether user profile exists', fakeAsync(() => {
    let username = 'test_username';

    spyOn(urlInterpolationService, 'interpolateUrl').and.returnValue(
      '/access_validation_handler/does_profile_exist/' + username
    );

    avbas.doesProfileExist(username).then(successSpy, failSpy);

    const req = httpTestingController.expectOne(
      '/access_validation_handler/does_profile_exist/' + username);
    expect(req.request.method).toEqual('GET');
    req.flush({});

    flushMicrotasks();
    expect(successSpy).toHaveBeenCalled();
    expect(failSpy).not.toHaveBeenCalled();
  }));

  it('should validate whether account deletion is enabled', fakeAsync(() => {
    avbas.accountDeletionIsEnabled().then(successSpy, failSpy);

    const req = httpTestingController.expectOne(
      '/access_validation_handler/account_deletion_is_enabled');
    expect(req.request.method).toEqual('GET');
    req.flush({});

    flushMicrotasks();
    expect(successSpy).toHaveBeenCalled();
    expect(failSpy).not.toHaveBeenCalled();
  }));

  it('should validate access to release coordinator page', fakeAsync(() => {
    avbas.validateAccessToReleaseCoordinatorPage().then(successSpy, failSpy);

    const req = httpTestingController.expectOne(
      '/access_validation_handler/can_access_release_coordinator_page');
    expect(req.request.method).toEqual('GET');
    req.flush({});

    flushMicrotasks();
    expect(successSpy).toHaveBeenCalled();
    expect(failSpy).not.toHaveBeenCalled();
  }));
});
