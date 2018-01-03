'use strict';

(function () {
    var app = angular.module('app');

    app.controller('KeywordsController', function ($scope, RepositoryFactory, resolveEntity) {
        $scope.resolveEntity = resolveEntity;
        var KeywordsCategoryRepository = new RepositoryFactory({
            endpoint: 'keywords/categories',
            retrieveItems: function (data) {
                return data._items;
            }
        });

        var KeywordsRepository = new RepositoryFactory({
            endpoint: 'keywords',
            retrieveItems: function (data) {
                return data._items;
            }
        });

        KeywordsCategoryRepository.readAll().then(function (keywordsCategories) {
            $scope.keywordsCategories = keywordsCategories;

            KeywordsRepository.readAll().then(function (keywords) {
                $scope.keywords = keywords;
            });
        });

        $scope.keywordsGridOptions = {
            data: 'keywords',
            enableCellSelection: false,
            enableCellEdit: true,
            keepLastSelected: false,
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: true,
            enableColumnResize: true,
            enableColumnReordering: true,
            showFilter: false,
            rowHeight: '40',
            columnDefs: [
                {
                    field: 'id',
                    displayName: 'ID',
                    enableCellEdit: false,
                    cellWidth: '80px'
                },
                {
                    field: 'value',
                    displayName: 'Value'
                },
                {
                    field: 'keywordCategoryID',
                    displayName: 'Category',
                    cellTemplate: 'app/keywords/partials/keywordCategoryGridCellEditor.html'
                },
                {
                    field: '',
                    displayName: 'Operations',
                    cellTemplate: 'app/keywords/partials/operationsGridCellEditor.html',
                    enableCellEdit: false,
                    sortable: false
                }
            ]
        };

        $scope.createKeyword = function (newKeyword) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            if (newKeyword.value.length > 0) {
                KeywordsRepository.createOne(newKeyword).then(function () {
                    KeywordsRepository.readAll().then(function (keywords) {
                        $scope.keywords = keywords;
                    });
                });
            }
        };

        $scope.updateKeyword = function (keyword) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            KeywordsRepository.updateOne(keyword);
        };

        $scope.deleteKeyword = function (keyword) {
            $scope.$broadcast('ngGridEventEndCellEdit');
            KeywordsRepository.deleteOne(keyword).then(function () {
                KeywordsRepository.readAll().then(function (keywords) {
                    $scope.keywords = keywords;
                });
            });
        };

        $scope.stopEditingKeywordCategory = function () {
            $scope.$broadcast('ngGridEventEndCellEdit');
        };

        $scope.$on('ngGridEventRows', function (newRows) {
            $scope.$broadcast('ngGridEventEndCellEdit');
        });
    });

})();