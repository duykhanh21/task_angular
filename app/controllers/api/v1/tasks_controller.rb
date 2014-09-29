module Api
  module V1
    class TasksController < ApplicationController
      skip_before_filter :verify_authenticity_token
      before_filter :find_model, except: [:index, :create]
      respond_to :json

      def index
        respond_with Task.all
      end

      def create
        @task = Task.new task_params
        if @task.save
          respond_to do |format|
            format.json{render json: @task}
          end
        end
      end

      def show
        respond_with @task
      end

      def update
        if @task.update task_params
          respond_to do |format|
            format.json{render json: @task}
          end
        end
      end

      def destroy
        respond_with Task.destroy params[:id]
      end

      private
      def find_model
        @task = Task.find(params[:id]) if params[:id]
      end

      def task_params
        params.permit(:title, :content)
      end
    end
  end
end
